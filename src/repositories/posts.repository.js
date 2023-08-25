
import db from "../database/database.js";

export async function allPosts(userId) {
    try {
        const result = await db.query(`/* SQL */
            SELECT posts.*, users."pictureUrl", users."userName",
            (
                SELECT COALESCE(json_agg(users."userName"), '[]')
                FROM likes
                JOIN users ON users.id = likes."userId"
                WHERE likes."postId" = posts.id
            ) AS likers,
            (
                SELECT COALESCE(json_agg(
                    json_build_object(
                        'comment', comments.comment,
                        'userName', users."userName",
                        'pictureUrl', users."pictureUrl",
                        'isFollowed',
                        EXISTS (
                            SELECT 1
                            FROM follows
                            WHERE follows."followedId" = comments."userId" AND follows."followerId" = $1
                        )
                    )
                ), '[]')
                FROM comments
                JOIN users ON users.id = comments."userId"
                WHERE comments."postId" = posts.id
            ) AS comments
            FROM posts 
            JOIN users ON users.id = posts."userId"
            JOIN follows ON follows."followerId" = $1
            WHERE follows."followedId" = posts."userId"
            ORDER BY id DESC LIMIT 20
        `, [userId]);

        return result;
    } catch (error) {
        // Handle the error here
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error if needed
    }
}

export async function newPost(userId, link, title,
    linkDescription, image, postDescription) {
    const query = await db.query(
        `INSERT INTO posts ("userId", url, "linkTitle", "linkDescription",
         "linkImage", "postDescription") VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
        [userId, link, title, linkDescription, image, postDescription]
    );
    return query;
}

export async function readPostById(id) {
    return await db.query(
        `/* SQL */
        SELECT posts.*, users."pictureUrl", users."userName" 
        FROM posts 
        JOIN users ON users.id = posts."userId" 
        WHERE posts.id = $1;`, [id]
    );
}

export async function getPostByUserId(userId) {
    return await db.query(
        `/* SQL */
        SELECT
        users."userName",
        users."pictureUrl",
        users.id,
        (
            SELECT COALESCE(JSON_AGG(users."userName"), '[]')
            FROM follows
            JOIN users ON users.id = follows."followerId"
            WHERE follows."followedId" = $1
        ) AS "followers",
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', posts.id,
                'url', posts.url,
                'linkTitle', posts."linkTitle",
                'linkDescription', posts."linkDescription",
                'linkImage', posts."linkImage",
                'postDescription', posts."postDescription",
                'pictureUrl', users."pictureUrl",
                'userName', users."userName",
                'userId', posts."userId",
                'likers', (
                    SELECT COALESCE(JSON_AGG(users."userName"), '[]')
                    FROM likes
                    JOIN users ON users.id = likes."userId"
                    WHERE likes."postId" = posts.id
                ),
                'comments', (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'comment', comments.comment,
                            'userName', users."userName",
                            'pictureUrl', users."pictureUrl",
                            'isFollowed',
                            EXISTS (
                                SELECT 1
                                FROM follows
                                WHERE follows."followedId" = comments."userId" AND follows."followerId" = $1
                            )
                        )
                    ), '[]')
                    FROM comments
                    JOIN users ON users.id = comments."userId"
                    WHERE comments."postId" = posts.id
                )
            )
            ORDER BY posts.id DESC
        ) FILTER (WHERE posts.id IS NOT NULL) AS "posts"
    FROM users
    LEFT JOIN posts ON users.id = posts."userId"
    WHERE users.id = $1
    GROUP BY users."userName", users."pictureUrl", users.id;
    
    
        `, [userId]
    );
}

export async function postDelete(id) {
    await db.query(`DELETE FROM likes WHERE "postId" = $1`, [id]);
    await db.query(`DELETE FROM reposts WHERE "postId" = $1`, [id]);
    await db.query(`DELETE FROM comments WHERE "postId" = $1`, [id]);
    return await db.query(`DELETE FROM posts WHERE id = $1;`, [id]);
}

export async function postEdit(id, description) {
    try {
    return await db.query(`UPDATE posts SET "postDescription" = $1 WHERE id = $2;`, [description, id])
    } catch (err) {
        console.error("Error in postEdit:", err);
    }
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

