import db from "../database/database.js";

export async function followUser (followerId, followedId){
    const result = await db.query('INSERT INTO follows ("followerId", "followedId") VALUES ($1, $2)', [followerId, followedId])
    return result
}

export async function unfollowUser (followerId, followedId){
    const result = await db.query('DELETE FROM follows WHERE "followerId" = $1 AND "followedId" = $2', [followerId, followedId])
    return result
}

