import { readPostsWithHashtag } from "../repositories/hashtag.repositories.js";

export default async function getHashtagByName(req, res) {
    const { hashtag } = req.params;

    try {
        const posts = await readPostsWithHashtag(hashtag);
        
        res.status(200).send(posts.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}