const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
const database = require('better-sqlite3');

const db = new database('diary.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    name TEXT
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY,
  subject_id INTEGER,
  grade INTEGER,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
  ON DELETE CASCADE
);
`);

db.exec(`
  DELETE FROM marks
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM marks
    GROUP BY subject_id
  );
`);
db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS marks_subject_unique
  ON marks(subject_id);
`);
db.pragma('foreign_keys = ON');

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
  const result = statement.run(name);
res.status(201).json({
  message: 'Subject created',
  id: result.lastInsertRowid
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
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.get('/marks', (req, res) => {
  const marks = db.prepare('SELECT * FROM marks').all();
  res.json(marks);
});

const addMarkStatement = db.prepare(`
  INSERT INTO marks (subject_id, grade)
  VALUES (?, ?)
  ON CONFLICT(subject_id) DO UPDATE SET grade = excluded.grade;
`);

console.log(db.prepare('SELECT * FROM marks').all());

app.post('/marks', (req, res) => {
  const subjectId = req.body.subject_id;
  const grade = req.body.grade;
  
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
  return res.status(400).json({
    message: 'Invalid grade'
  });
}
  if (!Number.isInteger(subjectId) || subjectId <= 0) {
    return res.status(400).json({
      message: 'Invalid subject ID'
    });
  }
  try {
  addMarkStatement.run(subjectId, grade);
  const mark = db.prepare('SELECT id FROM marks WHERE subject_id = ?').get(subjectId);

  res.status(201).json({
    message: 'Mark created',
    id: mark.id
  });
} catch (error) {
  res.status(500).json({
    message: 'Failed to create mark'
  });
}
  
});

const updateMark = db.prepare(`
  UPDATE marks
  SET grade = ?
  WHERE id = ?;
`);

app.put('/marks/:id', (req, res) => {
  const id = req.params.id;
  const grade = req.body.grade;
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
    return res.status(400).json({
      message: 'Invalid grade'
    });
  }
  try {
    const result = updateMark.run(grade, id);
    if (result.changes === 0) {
      return res.status(404).json({
        message: 'Mark not found'
      });
    }
    res.status(200).json({
      message: 'Mark updated'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update mark'
    });
  }
});



const deleteStatement = db.prepare(`
  DELETE FROM subjects
  WHERE id = ?;
`);

app.delete('/subjects/:id', (req, res) => {
  const id = req.params.id;
  try {
  const result = deleteStatement.run(id);
  if (result.changes === 0) {
    return res.status(404).json({
    message: 'Subject not found'
})}
res.status(200).json({
  message: 'Subject deleted'
});
  } catch (error) {
res.status(500).json({
  message: 'Failed to delete subject'
});
  }
});

const updateStatement = db.prepare(`
  UPDATE subjects
  SET name = ?
  WHERE id = ?;
`);

app.put('/subjects/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      message: 'Invalid subject name'
    });
  }
  try {
    const result = updateStatement.run(name, id);
    if (result.changes === 0) {
      return res.status(404).json({
        message: 'Subject not found'
      });
    }
    res.status(200).json({
      message: 'Subject updated'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update subject'
    });
  }
});

console.log(db.pragma('foreign_key_list(marks)'));