const createNotes = `
  CREATE TABLE IF NOT EXISTS notes (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  title VARCHAR,
   	  rating INTEGER,
	  user_id INTEGER, 
	  overview INTEGER, 
	  img INTEGER, 
	  accountid INTEGER, 
	  videoid INTEGER, 
	  youtube INTEGER, 
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  FOREIGN KEY(user_id) REFERENCES users(id)
)
`
;

module.exports = createNotes