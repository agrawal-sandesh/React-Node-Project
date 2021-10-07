const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/PMart.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the PMart database.');
});

module.exports = db;