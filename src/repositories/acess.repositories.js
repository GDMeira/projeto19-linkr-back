import db from "../database/database.js";

export function findSessionByToken(token) {
    return db.query(`
            SELECT id, "userId", token 
            FROM sessions
            WHERE token = $1;
        `, [token]);
}
//FUNÇÃO REGISTER
export async function findUsers(email){
    const result = await db.query(`SELECT * FROM users WHERE email =$1; `, [email])
    return result
}

export async function insertUsers(body){
    const {email, password,userName, pictureUrl} = body
    const hash = bcrypt.hashSync(password,2)
    const result = await db.query(`INSERT INTO users (email, password, "userName", "pictureUrl") VALUES ($1,$2,$3,$4);`,[email,hash,userName,pictureUrl])
    return result
}

//FUNCAO LOGIN

export async function comparePasswords(email){
    const result = await db.query(`select sessions."userId", sessions.token, users."userName",users.password,users.email, users."pictureUrl"
        from sessions
        join users on sessions."userId" = users.id
        WHERE users.email= $1`,[email])
    return result 
}

export async function insertUserSession(userId, token){
    const result =  await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1,$2);`,[userId, token])
    return result
}

//FUNCAO LOGOUT 
export async function findToken (token){
    const result = await db.query(`select sessions."userId", sessions.token, users."userName", users."pictureUrl"
    from sessions
    join users on sessions."userId" = users.id
    WHERE sessions.token= $1`,[token])
    return result
}
export function deleteSessionDB(userId) {
    return db.query(`
            DELETE FROM sessions
            WHERE "userId" = $1;
        `, [userId]);
}