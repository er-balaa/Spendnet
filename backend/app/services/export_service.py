import csv
import json
import shutil
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Tuple
from app.database import db
from app.config import settings

def clean_filename(name: str) -> str:
    return "".join(c if c.isalnum() or c in "._- " else "_" for c in name).strip()

def generate_exports() -> Tuple[Path, Path, Path]:
    """
    Generates actual physical export files, manifest.json, manifest.csv,
    and a downloadable ZIP archive.
    All manifest paths are relative paths inside the archive.
    """
    export_root = settings.exports_dir
    if export_root.exists():
        shutil.rmtree(export_root)
    export_root.mkdir(parents=True, exist_ok=True)

    records_dir = export_root / "conversations"
    routes_dir = export_root / "by_route"
    brief_dir = export_root / "manager_brief"

    records_dir.mkdir(parents=True, exist_ok=True)
    routes_dir.mkdir(parents=True, exist_ok=True)
    brief_dir.mkdir(parents=True, exist_ok=True)

    records = list(db.conversations.find({}).sort("record_ref", 1))
    manifest_rows = []

    # 1. Generate individual conversation markdown files
    for r in records:
        ref = r.get("record_ref", "UNKNOWN")
        stype = r.get("source_type")
        sid = r.get("source_id")
        rev = r.get("applied_revision", 1)
        routes = r.get("assigned_routes") or []
        has_override = r.get("manual_route_override") is not None
        status = r.get("review_status", "Unspecified")
        freshness = r.get("analysis_freshness", "not_applicable")
        title = r.get("title", "")
        person = r.get("person_name") or "Unassigned"
        role = r.get("person_role") or "Unknown"
        time_str = r.get("started_at") or "Unknown"
        has_text = r.get("has_usable_transcript", False)
        analysis = r.get("analysis")

        filename = f"{ref}_{clean_filename(title[:40])}.md"
        rel_path = f"conversations/{filename}"
        file_path = records_dir / filename

        # Write markdown content
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# Conversation Report: {ref} — {title}\n\n")
            f.write(f"- **Source Identity**: `({stype}, {sid})`\n")
            f.write(f"- **Reference**: `{ref}`\n")
            f.write(f"- **Applied Source Revision**: `Rev {rev}`\n")
            f.write(f"- **Timestamp**: `{time_str}` (Asia/Kolkata date: 2026-08-21)\n")
            f.write(f"- **Participant**: `{person}` ({role})\n")
            f.write(f"- **Assigned Routes**: {', '.join(routes)}\n")
            f.write(f"- **Manual Override**: {'Yes' if has_override else 'No'}\n")
            f.write(f"- **Review State**: `{status}`\n")
            f.write(f"- **Analysis Freshness**: `{freshness}`\n\n")

            f.write("## Routing Reasoning\n")
            f.write(f"{r.get('route_reasoning', 'None provided.')}\n\n")

            if analysis:
                f.write("## Summary & Analysis\n")
                f.write(f"{analysis.get('summary', '')}\n\n")

                findings = analysis.get("key_findings", [])
                if findings:
                    f.write("## Key Evidence-Backed Findings\n")
                    for finding in findings:
                        f.write(f"### {finding.get('topic')}\n")
                        f.write(f"- **Finding**: {finding.get('finding')}\n")
                        f.write(f"- **Evidence Reference**: {finding.get('evidence_ref')}\n")
                        if finding.get("exact_quote"):
                            f.write(f"- **Exact Quotation**: *\"{finding.get('exact_quote')}\"*\n")
                        if finding.get("screen_rule_impact"):
                            f.write(f"- **Product / Rule Impact**: {finding.get('screen_rule_impact')}\n")
                        f.write("\n")

                excerpts = analysis.get("evidence_excerpts", [])
                if excerpts:
                    f.write("## Supporting Evidence Excerpts\n")
                    for ex in excerpts:
                        prefix = f"[{ex.get('timecode', '')}] " if ex.get("timecode") else ""
                        speaker = f"{ex.get('speaker')}: " if ex.get("speaker") else ""
                        f.write(f"- **{prefix}{speaker}** *\"{ex.get('quote')}\"* — *Relevance*: {ex.get('relevance')}\n")
                    f.write("\n")

                actions = analysis.get("recommended_actions", [])
                if actions:
                    f.write("## Recommended Next Steps\n")
                    for a in actions:
                        owner = a.get("owner") or "Unassigned in text"
                        f.write(f"- [ ] **{a.get('action')}** (Owner: `{owner}`, Priority: `{a.get('priority')}`)\n")
                    f.write("\n")

                uncertainties = analysis.get("limitations_and_uncertainties", [])
                if uncertainties:
                    f.write("## Limitations & Uncertainty\n")
                    for u in uncertainties:
                        f.write(f"- {u}\n")
                    f.write("\n")

            else:
                f.write("## Conversation Text Status\n")
                f.write("No usable conversation text was supplied in this assessment package.\n")
                f.write(f"Source metadata reports duration `{r.get('duration_seconds', 0)}s`, connected=`{r.get('is_connected')}`.\n")
                f.write("Per data contract requirements, substantive analysis is not generated for records without usable text.\n")

        # 2. Add route references in by_route
        output_paths = [rel_path]
        for route in routes:
            route_folder = routes_dir / clean_filename(route)
            route_folder.mkdir(parents=True, exist_ok=True)
            route_link_file = route_folder / f"{ref}_{clean_filename(title[:30])}.md"
            with open(route_link_file, "w", encoding="utf-8") as rf:
                rf.write(f"# Route Assignment: {route}\n\n")
                rf.write(f"Refer to primary document: `../{rel_path}`\n\n")
                rf.write(f"- Record Ref: {ref}\n- Title: {title}\n- Review State: {status}\n")
            output_paths.append(f"by_route/{clean_filename(route)}/{route_link_file.name}")

        manifest_rows.append({
            "source_type": stype,
            "source_id": sid,
            "record_ref": ref,
            "title": title,
            "person_name": person,
            "applied_revision": rev,
            "assigned_routes": "; ".join(routes),
            "manual_route_override": has_override,
            "review_status": status,
            "analysis_freshness": freshness,
            "has_usable_transcript": has_text,
            "output_paths": output_paths
        })

    # 3. Write Manager Brief in export
    brief_file = brief_dir / "MANAGER_BRIEF_2026-08-21.md"
    from app.routers.brief import generate_brief_markdown
    with open(brief_file, "w", encoding="utf-8") as bf:
        bf.write(generate_brief_markdown())

    # 4. Write manifest.json
    manifest_json_path = export_root / "manifest.json"
    with open(manifest_json_path, "w", encoding="utf-8") as jf:
        json.dump({
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_records": len(manifest_rows),
            "manifest": manifest_rows
        }, jf, indent=2)

    # 5. Write manifest.csv
    manifest_csv_path = export_root / "manifest.csv"
    with open(manifest_csv_path, "w", encoding="utf-8", newline="") as cf:
        fieldnames = [
            "source_type", "source_id", "record_ref", "title", "person_name",
            "applied_revision", "assigned_routes", "manual_route_override",
            "review_status", "analysis_freshness", "has_usable_transcript", "output_paths"
        ]
        writer = csv.DictWriter(cf, fieldnames=fieldnames)
        writer.writeheader()
        for row in manifest_rows:
            csv_row = dict(row)
            csv_row["output_paths"] = "; ".join(row["output_paths"])
            writer.writerow(csv_row)

    # 6. Create ZIP archive
    zip_path = export_root.parent / "spendnest_exports.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in export_root.rglob("*"):
            if file.is_file():
                arcname = file.relative_to(export_root)
                zf.write(file, arcname)

    return export_root, zip_path, manifest_json_path
