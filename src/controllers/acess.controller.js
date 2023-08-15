import { db } from "../database/database.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export  async function register (req, res){
   const {email, password,userName, pictureUrl} = req.body
   const hash = bcrypt.hashSync(password,2)
   
    try{
        //CASO O USUARIO JA ESTEJA CADASTRADO
        const registroResponse = await db.query(`SELECT * FROM register WHERE email =$1; `, [email])
        if(registroResponse.rowCount !== 0 ) return res.sendStatus(409)
        
        await db.query(`INSERT INTO register (email, password, "userName", "pictureUrl") VALUES ($1,$2,$3,$4);`,[email,hash,userName,pictureUrl])
        res.sendStatus(201)
       
    }catch(error){
        res.status(500).send(error.message)
    }
} 

export async function login (req, res){
    const {email, password} = req.body
    const token = uuid()

      
    try{
    
        //USUARIO E SENHA COINCIDEM?
      const user = await db.query(`SELECT * FROM register WHERE email= $1`,[email])
      if(user.rowCount === 0) return res.sendStatus(401)
      const validateSenha = bcrypt.compareSync( password, user.rows[0].password)
      if(!validateSenha) return res.sendStatus(401)

      //SALVA OS DADOS DO USUARIO NA TABELA USERS
      await db.query(`INSERT INTO users ("userName", "pictureUrl", token) VALUES ($1,$2,$3);`,[user.rows[0].userName, user.rows[0].pictureUrl, token])
      res.redirect('/')
       
    }catch(error){
        res.status(500).send(error.message)
    }
}