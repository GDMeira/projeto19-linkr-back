import { db } from "../database/database.js";
import bcrypt from "bcrypt"
//import { v4 as uuid } from "uuid"

export  async function register (req, res){
   const {name, email, phone, cpf,password} = req.body
   const hash = bcrypt.hashSync(password,2)
    try{
        //CASO O USUARIO JA ESTEJA CADASTRADO
        const registroResponse = await db.query(`SELECT * FROM register WHERE email =$1; `, [email])
        if(registroResponse.rowCount !== 0 ) return res.sendStatus(409)
        
        await db.query(`INSERT INTO register (name, email, phone, cpf, password) VALUES ($1,$2,$3,$4,$5);`,[name,email,phone,cpf,hash])
        res.sendStatus(201)
       
    }catch(error){
        res.status(500).send(error.message)
    }
} 

export async function login (req, res){
 

    try{
    
        
        
       
    }catch(error){
        res.status(500).send(error.message)
    }
}