import { findUserSearchBar } from "../repositories/search.repositories.js";

export async function searchUser(req, res) {

    const {userId} = res.locals

    const { username } = req.query

    try {
        const result = await findUserSearchBar(username, userId)
        console.log(result.rows)
        return res.status(200).send(result.rows)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
