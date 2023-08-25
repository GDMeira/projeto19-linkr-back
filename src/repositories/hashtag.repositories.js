import db from "../database/database.js";

export function readPostsWithHashtag(hashtag) {
    return db.query(`
        SELECT 
            p.id, p.url, p."userId", p."postDescription", p."linkTitle", p."linkDescription", p."linkImage", 
            (
                SELECT users."pictureUrl"
                FROM users WHERE users.id = p."userId"
            ),
            (
                SELECT users."userName"
                FROM users WHERE users.id = p."userId"
            ),
            (
                SELECT COALESCE(json_agg(users."userName"), '[]')
                FROM likes
                JOIN users ON users.id = likes."userId"
                WHERE likes."postId" = p.id
            ) AS likers
        FROM posts AS p
        JOIN posts_hashtags ON posts_hashtags."postId" = p.id
        WHERE posts_hashtags."hashtagName" = $1;
    `, [hashtag]);
}

export function readHashtags() {
    return db.query(`
        SELECT hashtags.name
        FROM hashtags
        ORDER BY hashtags.count DESC
        LIMIT 10;
    `);
}

export function createHashtags(hashtags, postId) {
    return db.query(`/* SQL */
        WITH inserted_hashtags AS (
            INSERT INTO hashtags (name)
            VALUES ${hashtags.map((_, index) => `($${index + 2})`).join(', ')}
            ON CONFLICT (name) DO UPDATE SET count = hashtags.count + 1
            RETURNING name
        )
        INSERT INTO posts_hashtags ("postId", "hashtagName")
            SELECT $1, inserted_hashtags.name
            FROM inserted_hashtags
        ON CONFLICT DO NOTHING;
    `, [postId, ...hashtags]);
}

export function deleteHashsFromMidTableAndUpdateCount(hashtags, postId) {
    return db.query(`/* SQL */
        WITH deleted_hashtags AS (
            DELETE FROM posts_hashtags 
            WHERE posts_hashtags."hashtagName" = ANY($1) AND posts_hashtags."postId" = $2
            RETURNING "hashtagName"
        )
        UPDATE hashtags 
        SET count = count - 1
        WHERE name IN (SELECT "hashtagName" FROM deleted_hashtags);
    `, [hashtags, postId]);
}

export function deleteHashsWithNoCount() {
    return db.query(`/* SQL */
        DELETE FROM hashtags
        WHERE count = 0;
    `);
}