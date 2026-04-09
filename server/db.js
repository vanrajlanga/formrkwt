const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'crm.db');

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      office_number TEXT NOT NULL,
      ownership_type TEXT NOT NULL,
      owners TEXT NOT NULL,
      tenant TEXT,
      allotted_parking TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = { getDb, saveDb };
