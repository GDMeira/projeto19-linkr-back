import { db } from "../database/database.js";

export function readPostsWithHashtag(hashtag) {
    return db.query(`
        SELECT 
            p.id, p.url, p."postDescription", p."linkTitle", p."linkDescription", p."linkImage", 
            (
                SELECT json_build_object("pictureUrl",users."pictureUrl", "userName", users."userName")
                FROM users WHERE users.id = p."userId"
            ) AS writer,
            (
                SELECT users."userName"
                FROM likes
                JOIN users ON users.id = likes."userId"
                WHERE likes."postId" = p.id
            ) AS likers
        FROM posts AS p
        JOIN posts_hashtags ON posts_hashtags."postId" = p.id
        WHERE posts_hashtags."hashtagName" = $1;
    `, [hashtag]);
}

export function readHashtags(hashtag) {
    return db.query(`
        SELECT hashtags.name
        FROM hashtags
        ORDER BY hashtags.count DESC
        LIMIT 10;
    `, [hashtag]);
}