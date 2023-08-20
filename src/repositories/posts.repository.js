
import db from "../database/database.js";

export async function allPosts() {
    return await db.query(`
    SELECT posts.*, users."pictureUrl", users."userName",
    (
        SELECT COALESCE(json_agg(users."userName"), '[]')
        FROM likes
        JOIN users ON users.id = likes."userId"
        WHERE likes."postId" = posts.id
    ) AS likers
    FROM posts 
    JOIN users ON users.id = posts."userId"
    ORDER BY id DESC LIMIT 30`, []);
    //await db.query(`SELECT * FROM linkrs WHERE  = true LIMIT 30`)
    
} 

export async function newPost(userId, link, title, 
    linkDescription, image, postDescription){
     const query = await db.query(
        `INSERT INTO posts ("userId", url, "linkTitle", "linkDescription",
         "linkImage", "postDescription") VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
        [userId, link, title, linkDescription, image, postDescription]
      );
      return query;
}

export async function getPostById(id) {
    return await db.query(
        `SELECT posts.*, users."pictureUrl", users.name FROM posts JOIN
         users ON users.id = posts."userId" WHERE post.id = $1 
         ORDER BY date DESC`, [id]
      );
}

export async function getPostByUserId(userId) {
    return await db.query(
      `SELECT posts.*, users."pictureUrl", users."userName" FROM posts JOIN
       users ON users.id = posts."userId" WHERE posts."userId" = $1 
       ORDER BY posts.id DESC`, [userId]
    );
}

export async function postOwner(user, id) {
    return await db.query(
        `SELECT user_id, id FROM posts WHERE user_id = $1 and id = $2`,
        [user.id, id]
      );
}

export async function postDelete(id) {
    return await db.query(`DELETE FROM posts WHERE id = $1;`, [id]);
}

export function createLike(postId, userId) {
    return db.query(
        `INSERT INTO likes ("postId", "userId") VALUES ($1, $2);`,
        [postId, userId]
      );
}

export function deleteLikeDB(postId, userId) {
    return db.query(`
        DELETE FROM likes
        WHERE "postId" = $1 AND "userId" = $2;`,
        [postId, userId]
      );
}