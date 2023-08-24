import db from "../database/database.js";

export function createCommentDB(comment, postId, userId) {
    return db.query(`/* SQL */
        INSERT INTO comments ("comment", "postId", "userId")
        VALUES ($1, $2, $3);
    `, [comment, postId, userId]);
}