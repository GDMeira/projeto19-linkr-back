import urlMetadata from "url-metadata";
import { allPosts, newPost, getPostByUserId, postOwner, postDelete, createLike, deleteLikeDB } from "../repositories/posts.repository.js";
import db from "../database/database.js";
import reactStringReplace from "react-string-replace";
import { createHashtags } from "../repositories/hashtag.repositories.js";

export async function postLink(req, res) {
  const userId = res.locals.userId;

  const { link, postDescription } = req.body;

  try {
    const result = await urlMetadata(link);
    const postDB = await newPost(userId, link, result.title, result.description, result.image, postDescription);

    if (postDB.rowCount === 0) return res.status(404).send("This post could not be posted");
    const hashtags = [];
    reactStringReplace(postDescription, /#(\w+)/g, (match) => hashtags.push(match));
    if (hashtags.length > 0) createHashtags(hashtags, postDB.rows[0].id);

    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getposts(req, res) {
  const user = res.locals.user;

  try {
    const getPosts = await allPosts();

    res.status(200).send(getPosts.rows)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}


export async function getPostById(req, res) {
  const { id } = req.params;

  try {
    const getPost = await getPostById(id);
    return res.send(getPost.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getPostByUser(req, res) {
  const { id } = req.params;

  try {
    const getUserPosts = await getPostByUserId(id);
    return res.send(getUserPosts.rows[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;
  const user = res.locals.user;

  if (!id) return res.status(404).send("Post doesn't exist");
  try {
    const owner = postOwner(user, id)
    if (!owner.rowCount) return res.sendStatus(401);
    const deletePost = postDelete(id)
    if (!deletePost.rowCount) return res.sendStatus(400);

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function postLike(req, res) {
  const { postId } = req.params;
  if (!Number(postId) || Number(postId) < 1) return res.status(404).send('Id do post inválido.')
  
  try {
    await createLike(postId, res.locals.userId);

    res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteLike(req, res) {
  const { postId } = req.params;
  if (!Number(postId) || Number(postId) < 1) return res.status(404).send('Id do post inválido.')
  
  try {
    await deleteLikeDB(postId, res.locals.userId);

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}