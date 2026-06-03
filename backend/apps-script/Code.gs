/**
 * UniHub – Google Apps Script backend.
 *
 * Deploy as: Extensions → Apps Script → Deploy → New deployment →
 *   Type: Web app, Execute as: Me, Who has access: Anyone (with the link).
 * Copy the /exec URL into APPS_SCRIPT_URL in your NestJS .env.
 *
 * Sheets are auto-created on first call: users, universities, applications, sessions.
 * Every row uses an `id` column (string, primary key). The first row holds headers.
 *
 * Security: the NestJS backend sends a shared `token` in every request body.
 * Set the same value in Project Settings → Script properties → SHARED_TOKEN
 * (or hard-code SHARED_TOKEN below for quick start).
 */

// =========================== CONFIG ===========================
// Either set this here, or (preferred) set Script Property "SHARED_TOKEN".
var DEFAULT_SHARED_TOKEN = 'replace-with-a-shared-secret';

var SCHEMAS = {
  users: ['id', 'email', 'name', 'passwordHash', 'createdAt'],
  universities: [
    'id', 'ownerId', 'name', 'country', 'websiteUrl',
    'applicationPortalUrl', 'notes', 'createdAt'
  ],
  applications: [
    'id', 'ownerId', 'universityId', 'program', 'intakeTerm',
    'status', 'notes', 'createdAt', 'updatedAt'
  ],
  sessions: ['id', 'userId', 'createdAt']
};

// =========================== ENTRYPOINT ===========================
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var expected = PropertiesService.getScriptProperties()
      .getProperty('SHARED_TOKEN') || DEFAULT_SHARED_TOKEN;
    if (!body.token || body.token !== expected) {
      return _json({ ok: false, error: 'unauthorized' });
    }
    var action = body.action;
    var sheet = body.sheet;
    if (!SCHEMAS[sheet]) return _json({ ok: false, error: 'unknown sheet' });

    var handlers = {
      list:     function () { return _list(sheet); },
      findById: function () { return _findById(sheet, body.id); },
      findBy:   function () { return _findBy(sheet, body.where || {}); },
      insert:   function () { return _insert(sheet, body.row || {}); },
      update:   function () { return _update(sheet, body.id, body.patch || {}); },
      remove:   function () { return _remove(sheet, body.id); }
    };
    if (!handlers[action]) return _json({ ok: false, error: 'unknown action' });
    return _json({ ok: true, data: handlers[action]() });
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return _json({ ok: true, data: 'UniHub Apps Script is alive' });
}

// =========================== CRUD ===========================
function _list(name) {
  var rows = _readAll(name);
  return rows;
}

function _findById(name, id) {
  if (!id) return null;
  var rows = _readAll(name);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].id === id) return rows[i];
  }
  return null;
}

function _findBy(name, where) {
  var keys = Object.keys(where);
  if (keys.length === 0) return null;
  var rows = _readAll(name);
  for (var i = 0; i < rows.length; i++) {
    var match = true;
    for (var k = 0; k < keys.length; k++) {
      if (rows[i][keys[k]] !== where[keys[k]]) { match = false; break; }
    }
    if (match) return rows[i];
  }
  return null;
}

function _insert(name, row) {
  var sheet = _getSheet(name);
  var headers = SCHEMAS[name];
  if (!row.id) row.id = Utilities.getUuid();
  var values = headers.map(function (h) { return row[h] != null ? row[h] : ''; });
  sheet.appendRow(values);
  return row;
}

function _update(name, id, patch) {
  if (!id) return null;
  var sheet = _getSheet(name);
  var headers = SCHEMAS[name];
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === id) {
      var obj = _rowToObject(headers, data[r]);
      Object.keys(patch).forEach(function (k) { obj[k] = patch[k]; });
      var values = headers.map(function (h) { return obj[h] != null ? obj[h] : ''; });
      sheet.getRange(r + 1, 1, 1, headers.length).setValues([values]);
      return obj;
    }
  }
  return null;
}

function _remove(name, id) {
  if (!id) return false;
  var sheet = _getSheet(name);
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === id) {
      sheet.deleteRow(r + 1);
      return true;
    }
  }
  return false;
}

// =========================== HELPERS ===========================
function _readAll(name) {
  var sheet = _getSheet(name);
  var headers = SCHEMAS[name];
  var data = sheet.getDataRange().getValues();
  var out = [];
  for (var r = 1; r < data.length; r++) {
    if (!data[r][0]) continue; // skip empty rows
    out.push(_rowToObject(headers, data[r]));
  }
  return out;
}

function _rowToObject(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i];
  }
  return obj;
}

function _getSheet(name) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, SCHEMAS[name].length).setValues([SCHEMAS[name]]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SCHEMAS[name].length).setValues([SCHEMAS[name]]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
