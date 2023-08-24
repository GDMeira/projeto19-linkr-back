import db from "../database/database.js";

export async function findUserSearchBar (search, userId){
    const result = await db.query(`
    SELECT users.id, users."userName", users."pictureUrl", follows."followedId" AS "isFollowing"
    FROM users
    LEFT JOIN follows ON users.id = follows."followedId" AND follows."followerId" = $2
    WHERE "userName" ILIKE $1
    ORDER BY follows."followedId" DESC NULLS LAST;


    `, [`%${search}%`, userId])
    return result
}