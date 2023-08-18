import { readHashtags, readPostsWithHashtag } from "../repositories/hashtag.repositories.js";

export async function getHashtagByName(req, res) {
    const { hashtag } = req.params;

    try {
        const posts = await readPostsWithHashtag(hashtag);
        
        res.status(200).send(posts.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export default async function getTrending(req, res) {
    try {
        const hashtags = await readHashtags();
        
        res.status(200).send(hashtags.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}