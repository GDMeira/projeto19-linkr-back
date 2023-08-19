import db from "../database/database.js";

export function findSessionByToken(token) {
    return db.query(`
            SELECT id, "userId", token 
            FROM sessions
            WHERE token = $1;
        `, [token]);
}