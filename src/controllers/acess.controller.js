
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { comparePasswords, findToken, findUsers, insertUserSession, insertUsers } from "../repositories/acess.repositories.js";

export async function register(req, res) {
    const { email } = req.body

    try {
        //CASO O USUARIO JA ESTEJA CADASTRADO
        const registroResponse = await findUsers(email)
        if (registroResponse.rowCount !== 0) return res.sendStatus(409)

        const { password } = req.body;
        const hash = bcrypt.hashSync(password, 10)
        await insertUsers(req.body, hash)
        res.sendStatus(201)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export async function login(req, res) {
    const { email, password } = req.body
    const token = uuid()
    try {

        //USUARIO E SENHA COINCIDEM?
        const user = await comparePasswords(email)

        if (user.rowCount === 0) return res.sendStatus(401)
        const validateSenha = bcrypt.compareSync(password, user.rows[0].password)
        if (!validateSenha) return res.status(401).send('As senhas nao sao iguais')

        //SALVA OS DADOS DO USUARIO NA TABELA sessions
        console.log(user.rows[0],"dados do user")
        await insertUserSession(user.rows[0].id, token)
        const response = {
            image: user.rows[0].pictureUrl,
            userName: user.rows[0].userName,
            token,
            id: user.rows[0].id
        };

        res.status(201).send(response) //  REDIRECIONA PARA A PAGINA SEGUINTE

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function logout(req, res) {
    const { authorization } = req.headers
    const token = authorization.replace('Bearer ', '')
    console.log(token)

    try {

        //SE O TOKEN EXISTE PODE DESLOGAR
        const user = await findToken(token)
        
        
        if (user.rowCount === 0) return res.sendStatus(401)
        
        res.status(200).send(user.rows[0])

    } catch (error) {
        res.status(500).send(error.message)
    }
}
/*export async function deleteSession(req, res) {
    try {
        await deleteSessionDB(res.locals.userId)
    } catch (error) {
        res.status(500).send(error.message)
    }
}*/