import urlMetadata from "url-metadata";
import { allPosts, newPost, getPostByUserId, postOwner, postDelete, createLike, deleteLikeDB, postEdit } from "../repositories/posts.repository.js";
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
    reactStringReplace(postDescription, /#(\w+)/g, (match) => {
      if (!hashtags.includes(match)) hashtags.push(match)
    });
    if (hashtags.length > 0) createHashtags(hashtags, postDB.rows[0].id);

    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getposts(req, res) {
  const userId = res.locals.userId;

  try {
    const getPosts = await allPosts(userId);

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
  const { postId } = req.params;
  console.log(postId)
  if (!postId) return res.status(404).send("Post doesn't exist");
  try {
    postDelete(postId)

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function editPost(req, res) {
  const {postId} = req.params;
  console.log(req.params)
  console.log(postId)
  const {description} = req.body
  console.log(description)
  if (!postId) return res.status(404).send("Post doesn't exist");
  try {

    postEdit(postId, description)

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    return res.status(500).send(console.log(error.message));
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
