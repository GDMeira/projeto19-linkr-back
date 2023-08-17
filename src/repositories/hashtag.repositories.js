import { db } from "../database/database.js";

export function readPostsWithHashtag(hashtag) {
    return db.query(`
        SELECT * 
        FROM posts
        JOIN posts_hashtags ON posts_hashtags."postId" = posts.id
        WHERE posts_hashtags."hashtagName" = $1;
    `, [hashtag]);
}