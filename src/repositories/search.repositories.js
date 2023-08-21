import db from "../database/database.js";

export async function findUserSearchBar (search){
    const result = await db.query('SELECT * FROM users WHERE "userName" ILIKE $1', [`%${search}%`])
    return result
}