/** Coordinator Data Analysis Dashboard - backend (Google Apps Script) */
const SS_ID = '1HDgE8cLdW5U0EYOCT9oo7eJotWNY8LY19omcHe5LT8s';
const GID = 1620728198;
const TZ = 'Asia/Kolkata';
const P = () => PropertiesService.getScriptProperties();

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Coordinator Data Analysis')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sheet_() {
  const sh = SpreadsheetApp.openById(SS_ID).getSheets().filter(s => s.getSheetId() === GID)[0];
  if (!sh) throw new Error('Sheet with gid ' + GID + ' not found');
  return sh;
}

/** Read-only. Returns real headers + rows exactly as in the sheet. */
function getData() {
  const v = sheet_().getDataRange().getValues();
  const headers = v.shift().map(String);
  const rows = v.filter(r => r.some(c => c !== '')).map(r => r.map(c =>
    c instanceof Date ? Utilities.formatDate(c, TZ, "yyyy-MM-dd'T'HH:mm:ss") : c));
  const now = new Date();
  return {
    headers: headers, rows: rows,
    today: Utilities.formatDate(now, TZ, 'yyyy-MM-dd'),
    updated: Utilities.formatDate(now, TZ, 'dd MMM yyyy, hh:mm a'),
    lastSync: P().getProperty('LAST_SYNC') || '',
    settings: JSON.parse(P().getProperty('TARGETS') || '{"daily":{},"monthly":{},"cat":{}}')
  };
}

/** Admin-only write. Set Script Property ADMIN_PIN first (see README). */
function saveSettings(pin, settings) {
  const real = P().getProperty('ADMIN_PIN');
  if (!real) throw new Error('ADMIN_PIN is not configured in Script Properties.');
  if (String(pin) !== real) throw new Error('Invalid admin PIN.');
  P().setProperty('TARGETS', JSON.stringify(settings));
  return true;
}

/** Run once from the editor to create the form-submit trigger. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(SS_ID).onFormSubmit().create();
}

function onFormSubmit() {
  P().setProperty('LAST_SYNC', Utilities.formatDate(new Date(), TZ, 'dd MMM yyyy, hh:mm a'));
}
