import urlMetadata from "url-metadata";
import { allPosts, newPost, getPostByUserId, postOwner, postDelete } from "../repositories/posts.repository.js";
import db from "../database/database.js";

export async function postLink(req, res) {
  const userId = res.locals.userId;

  const { link, postDescription } = req.body;

  try {
    const result = await urlMetadata(link);
    console.log(result.title, result.description, result.image)
    const confirm = await newPost(userId, link, result.title, result.description, result.image, postDescription);

    if (!confirm) return res.status(404).send("This post could not be posted");

    res.sendStatus(201)
  } catch (err) {
    // console.log(err)
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
    return res.send(getUserPosts.rows);
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