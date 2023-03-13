const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage');
const sqliteConnection = require("../database/sqlite")

class UserAvatarController {
    async update(req, res) {
        const user_id = req.user.id;
        const avatarFilename = req.file.filename;

        const diskStorage = new DiskStorage()
        const database = await sqliteConnection()

        const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [user_id])

        if (!user) {
            throw new AppError("Somente usuarios autenticados podem mudar o avatar", 401);
        }

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename; 
 
        await database.run(`
        UPDATE users set
        avatar = ?,
        updated_at = DATETIME ('now') 
        WHERE id = ?` ,
        [filename, user_id ])

        return res.json(user)
    }
}

module.exports = UserAvatarController