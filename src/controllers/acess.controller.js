import db from "../database/database.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { deleteSessionDB } from "../repositories/acess.repositories.js";

export  async function register (req, res){
   const {email, password, userName, pictureUrl} = req.body
//    console.log(req.body)
   const hash = bcrypt.hashSync(password, 10)
   console.log()
    try{
        //CASO O USUARIO JA ESTEJA CADASTRADO
        const registroResponse = await db.query(`SELECT * FROM users WHERE email =$1; `, [email])
        if(registroResponse.rowCount !== 0 ) return res.sendStatus(409)
        
        await db.query(`INSERT INTO users (email, password, "userName", "pictureUrl") VALUES ($1,$2,$3,$4);`,[email,hash,userName,pictureUrl])
        res.sendStatus(201)
       
    }catch(error){
        console.log(error)
        res.status(500).send(error.message)
    }
} 

export async function login (req, res){
    const { email, password } = req.body
    const token = uuid()
      
    try{
    
        //USUARIO E SENHA COINCIDEM?
      const user = await db.query(`SELECT * FROM users WHERE email= $1;`,[email])
      if(user.rowCount === 0) return res.sendStatus(401)
      const validateSenha = bcrypt.compareSync(password, user.rows[0].password)
      if(!validateSenha) return res.sendStatus(401)
      
      //SALVA OS DADOS DO USUARIO NA TABELA sessions
      await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1,$2);`,[user.rows[0].id, token])
      const userInfo = {
        token,
        userName: user.rows[0].userName,
        image: user.rows[0].pictureUrl
      }

      res.send(userInfo)
    }catch(error){
        res.status(500).send(error.message)
    }
}

export async function deleteSession(req, res) {
    try {
        await deleteSessionDB(res.locals.userId)   
    } catch (error) {
        res.status(500).send(error.message)
    }
}