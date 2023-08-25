import db from "../database/database.js";
import urlMetadata from "url-metadata";
import { allPosts, newPost, getPostByUserId, postDelete, createLike, deleteLikeDB, postEdit, readPostById } from "../repositories/posts.repository.js";
import reactStringReplace from "react-string-replace";
import { createHashtags, deleteHashsFromMidTableAndUpdateCount, deleteHashsWithNoCount } from "../repositories/hashtag.repositories.js";

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
    const getPost = await readPostById(id);
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
    console.log(error)
    return res.status(500).send(error.message);
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  if (!postId) return res.status(404).send("Post doesn't exist");
  try {
    const post = await readPostById(postId);
    const hashtags = [];
    reactStringReplace(post.rows[0].postDescription, /#(\w+)/g, (match) => {
      if (!hashtags.includes(match)) hashtags.push(match)
    });

    await deleteHashsFromMidTableAndUpdateCount(hashtags, postId);
    await deleteHashsWithNoCount();
    postDelete(postId)

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function editPost(req, res) {
  const { postId } = req.params;
  const { description } = req.body
  if (!postId) return res.status(404).send("Post doesn't exist");

  const newHashtags = [];
  reactStringReplace(description, /#(\w+)/g, (match) => {
    if (!newHashtags.includes(match)) newHashtags.push(match)
  });

  const post = await readPostById(postId);

  const olderHashtags = [];
  reactStringReplace(post.rows[0].postDescription, /#(\w+)/g, (match) => {
    if (!olderHashtags.includes(match)) olderHashtags.push(match)
  });

  const deletedHashtags = olderHashtags.filter(h => !newHashtags.includes(h));
  const createdHashtags = newHashtags.filter(h => !olderHashtags.includes(h));

  try {
    if (createHashtags.length > 0) await createHashtags(createdHashtags, postId);
    if (deletedHashtags.length > 0) {
      await deleteHashsFromMidTableAndUpdateCount(deletedHashtags, postId);
      await deleteHashsWithNoCount();
    }

    postEdit(postId, description)

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
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
export async function reposts(req, res){
  const {postId, userId}= req.body 
  console.log(postId)
  
  try {
    const posts = await db.query(`SELECT * FROM posts WHERE id=$1`,[postId])
    console.log(posts.rows)
    return res.sendStatus(204);
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message);
  }
}
