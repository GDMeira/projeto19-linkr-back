import { followUser, unfollowUser, getFolloweds } from "../repositories/follow.repositories.js";
import db from "../database/database.js";
import e from "cors";

export async function follow(req, res) {
    const followerId = res.locals.userId;
        
    const { followedId } = req.params

    const isFollower = await db.query('SELECT * FROM follows WHERE "followerId" = $1 AND "followedId" = $2', [followerId, followedId])

    if(!followerId || !followedId){
        return res.sendStatus(400)
    }

    if (followerId === followedId) {
        return res.sendStatus(400)
    }

    if (isFollower.rowCount > 0) {
        return res.sendStatus(400)
    }

    try {
        await followUser(followerId, followedId);
        res.sendStatus(201);
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500);
    }

}

export async function unfollow(req, res) {
    const followerId = res.locals.userId;
        
    const { followedId } = req.params

    if(!followerId || !followedId){
        return res.sendStatus(400)
    }

    const isFollower = await db.query('SELECT * FROM follows WHERE "followerId" = $1 AND "followedId" = $2', [followerId, followedId])

    if (isFollower.rowCount === 0) {
        return res.sendStatus(400)
    }

    try {
        await unfollowUser(followerId, followedId);
        res.sendStatus(201);
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500);
    }

}

export async function getFollowedsUsers(req, res) {
    const followerId = res.locals.userId;

    try {
        const result = await getFolloweds(followerId);
        res.send(result.rows);
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
}
    