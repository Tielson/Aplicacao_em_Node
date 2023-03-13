const createTags = `
  CREATE TABLE IF NOT EXISTS tags (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
  	note_id INTEGER, 
  	user_id INTEGER,
  	name VARCHAR, 
	FOREIGN KEY(user_id) REFERENCES users(id),
  	FOREIGN KEY(note_id) REFERENCES notes(id)
	ON DELETE CASCADE
  )
`;



module.exports = createTags