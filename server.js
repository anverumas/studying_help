const express = require('express');
const app = express();
const database = require('better-sqlite3');
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
