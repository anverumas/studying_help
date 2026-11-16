const express = require('express');
const app = express();
app.use(express.json());
const database = require('better-sqlite3');
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
const db = new database('diary.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    name TEXT,
    final_grade  integer
  );
`);
console.log(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all());
const statement = db.prepare(`
  INSERT INTO subjects (name)
  VALUES (?);
`);