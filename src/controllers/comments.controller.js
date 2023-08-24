import { createCommentDB } from "../repositories/comment.repositories.js";

export async function createComment(req, res) {
    const { comment } = req.body;
    const { postId } = req.params;

    try {
        await createCommentDB(comment, postId, res.locals.userId);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}