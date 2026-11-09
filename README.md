# Coordinator Data Analysis Dashboard (Google Apps Script)

Files: Code.gs (backend) · Index.html (dashboard UI) · appsscript.json (manifest)

## Deploy (5 minutes)
1. Go to script.google.com -> New project. Name it "Coordinator Dashboard".
2. Paste Code.gs into the default Code.gs. Add an HTML file named exactly `Index` and paste Index.html.
3. Project Settings -> tick "Show appsscript.json" and paste appsscript.json.
4. Project Settings -> Script Properties -> add `ADMIN_PIN` = your secret PIN (needed only to save targets).
5. In the editor run `installTrigger` once (authorize). This adds the onFormSubmit sync trigger.
6. Deploy -> New deployment -> Web app -> Execute as: Me, Who has access: Anyone -> Deploy.
7. Open the Web app URL: the dashboard loads directly, no login page.

## Notes
- The sheet is never made public; only the script (running as you) reads it, read-only.
- Columns are detected from real headers: Timestamp, Email, Work (any header containing these words).
  An Assigner column is used only if a header contains "assigner" / "assigned by"; otherwise the section is labelled Coordinator Wise.
- Today's Count uses the live Asia/Kolkata date, ignoring date filters.
- Excel export is an .xls (HTML table) that opens in Excel.
- Targets are never auto-generated; they are saved in Script Properties via Settings + ADMIN_PIN.
- Not tested against your live sheet from here (no access): after deploying, check a few totals against the sheet.
