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
console.log(db.prepare('SELECT * FROM subjects').all());
app.post('/subjects', (req, res) => {
  const name = req.body.name;
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      message: 'Invalid subject name'
    });
  }
  try {
  statement.run(name);
res.status(201).json({
  message: 'Subject created'
});
  } catch (error) {
res.status(500).json({
  message: 'Failed to save subject'
});
  }
});

app.get('/subjects', (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects').all();
  res.json(subjects);
});