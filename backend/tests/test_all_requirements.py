import json
import random
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import db
from app.services.import_service import reset_and_seed, import_file, import_batch_from_dict
from app.config import settings

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Reset to initial state before each test
    reset_and_seed("initial")
    yield

def test_01_initial_import_record_count():
    """1. Initial import creates exactly 44 unique records with 17 usable transcripts."""
    assert db.conversations.count_documents({}) == 44
    assert db.conversations.count_documents({"source_type": "call"}) == 30
    assert db.conversations.count_documents({"source_type": "meeting"}) == 14
    assert db.conversations.count_documents({"has_usable_transcript": True}) == 17

def test_02_repeated_imports_no_duplicates():
    """2. Repeated imports do not create duplicates or inflate counts."""
    # Import initial again
    res = import_file(settings.initial_data_path)
    assert res.ignored_records == 44
    assert res.inserted_records == 0
    assert db.conversations.count_documents({}) == 44

def test_03_import_order_independence():
    """3. Import order does not change the final logical record set."""
    with open(settings.initial_data_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Shuffle records
    records = list(data["records"])
    random.shuffle(records)
    data["records"] = records

    # Import shuffled
    res = import_batch_from_dict(data, filename="shuffled.json")
    assert db.conversations.count_documents({}) == 44

def test_04_update_modifies_existing_record():
    """4. The update modifies the existing M07 record instead of inserting a duplicate."""
    # Before update
    m07_before = db.conversations.find_one({"record_ref": "M07"})
    assert m07_before["applied_revision"] == 1
    assert m07_before["has_usable_transcript"] == False

    # Apply update batch
    res = import_file(settings.update_data_path)
    assert res.updated_records == 1
    assert res.inserted_records == 0
    assert db.conversations.count_documents({}) == 44  # Unique count remains 44!

    # After update
    m07_after = db.conversations.find_one({"record_ref": "M07"})
    assert m07_after["applied_revision"] == 2
    assert m07_after["has_usable_transcript"] == True
    assert len(m07_after["transcript_payload"]["turns"]) == 27

def test_05_full_record_replacement():
    """5. Full-record replacement follows the actual data contract."""
    # Apply update batch
    import_file(settings.update_data_path)
    m07 = db.conversations.find_one({"record_ref": "M07"})
    # Replaced transcript payload with non-null turns
    assert m07["transcript_payload"]["unavailable_reason"] is None
    assert len(m07["transcript_payload"]["turns"]) == 27

def test_06_older_revisions_cannot_overwrite_newer():
    """6. Older revisions cannot overwrite newer source data."""
    # Apply update (revision 2)
    import_file(settings.update_data_path)
    m07 = db.conversations.find_one({"record_ref": "M07"})
    assert m07["applied_revision"] == 2

    # Attempt to re-apply initial batch (revision 1)
    res = import_file(settings.initial_data_path)
    m07_check = db.conversations.find_one({"record_ref": "M07"})
    assert m07_check["applied_revision"] == 2  # Still 2!
    assert m07_check["has_usable_transcript"] == True

def test_07_manual_route_overrides_survive_imports():
    """7. Manual route overrides survive subsequent batch imports."""
    # Set manual override on M07
    m07 = db.conversations.find_one({"record_ref": "M07"})
    override_route = ["Customer Follow-up", "Human Review"]
    resp = client.patch(
        f"/api/conversations/{m07['source_type']}/{m07['source_id']}/routes",
        json={"routes": override_route, "review_notes": "Manager manual override test"}
    )
    assert resp.status_code == 200

    # Apply update batch
    import_file(settings.update_data_path)

    # Verify manual override survived!
    m07_updated = db.conversations.find_one({"record_ref": "M07"})
    assert m07_updated["manual_route_override"] == override_route
    assert m07_updated["assigned_routes"] == override_route

def test_08_manual_route_overrides_persist():
    """8. Manual route overrides survive application reload and queries."""
    m07 = db.conversations.find_one({"record_ref": "M07"})
    override_route = ["Sales Coaching"]
    client.patch(
        f"/api/conversations/{m07['source_type']}/{m07['source_id']}/routes",
        json={"routes": override_route}
    )

    # Query via API
    resp = client.get(f"/api/conversations/{m07['source_type']}/{m07['source_id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["manual_route_override"] == override_route
    assert data["assigned_routes"] == override_route

def test_09_dashboard_counts_and_denominators():
    """9. Dashboard counts use unique records and correct denominators."""
    resp = client.get("/api/dashboard/metrics")
    assert resp.status_code == 200
    metrics = resp.json()

    assert metrics["total_unique_records"] == 44
    assert metrics["total_calls"] == 30
    assert metrics["total_meetings"] == 14
    assert metrics["transcript_coverage"]["denominator"] == 44
    assert metrics["transcript_coverage"]["numerator"] == 17
    assert metrics["call_connection_metrics"]["stored_connection_rate"]["denominator"] == 30

def test_10_missing_transcripts_honestly_handled():
    """10. Missing transcripts are handled honestly without fabricated text."""
    b01 = db.conversations.find_one({"record_ref": "B01"})
    assert b01["has_usable_transcript"] == False
    assert b01["review_status"] == "Unusable Text"
    assert b01["analysis"] is None

    m05 = db.conversations.find_one({"record_ref": "M05"})
    assert m05["has_usable_transcript"] == False
    assert m05["review_status"] == "Missing Transcript"
    assert m05["analysis"] is None

def test_11_exports_match_manifest():
    """11. Generated exports exist and match their manifest."""
    resp = client.post("/api/exports/generate")
    assert resp.status_code == 200

    resp_m = client.get("/api/exports/manifest")
    assert resp_m.status_code == 200
    manifest = resp_m.json()
    assert manifest["total_records"] == 44

    export_root = settings.exports_dir
    assert (export_root / "manifest.json").exists()
    assert (export_root / "manifest.csv").exists()
    assert (export_root.parent / "spendnest_exports.zip").exists()

def test_12_export_download_works():
    """12. Export download endpoint returns ZIP file."""
    resp = client.get("/api/exports/download")
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/zip"
    assert len(resp.content) > 1000

def test_13_manager_brief_evidence_links():
    """13. The manager brief links to supporting evidence."""
    resp = client.get("/api/brief/")
    assert resp.status_code == 200
    brief = resp.json()
    assert "M07 Turn 22" in brief["content_markdown"]
    assert "C06 Call Transcript" in brief["content_markdown"]
    assert "C09 Call Transcript" in brief["content_markdown"]

def test_14_updated_source_text_flags_stale_analysis():
    """14. Updated source text does not silently retain stale analysis when overridden."""
    # Set manual override on M07 before update
    m07 = db.conversations.find_one({"record_ref": "M07"})
    client.patch(
        f"/api/conversations/{m07['source_type']}/{m07['source_id']}/routes",
        json={"routes": ["Sales Coaching"]}
    )

    # Apply update batch
    import_file(settings.update_data_path)

    # Check that analysis freshness is flagged as stale_pending_review
    m07_updated = db.conversations.find_one({"record_ref": "M07"})
    assert m07_updated["analysis_freshness"] == "stale_pending_review"
