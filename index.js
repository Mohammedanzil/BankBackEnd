//Import express inside index.js
const express = require('express')

//import cors in index.js
const cors = require('cors')

//import dataservice
const dataservice = require('./services/dataService')

//import jsonwebyoken
const jwt=require('jsonwebtoken')

//create server app using express
const server = express()

//use cors to define origin 
server.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data 
server.use(express.json())

//set up port number for server app
server.listen(3000,()=>{
    console.log('Server started at 3000');
})

//application specific Middleware
const appMiddleware =(req,res,next)=>{
    console.log("Inside application Middleware");
    next()
}
server.use(appMiddleware)

//bankapp front end request resolving

//token verify middleware
const jwtMiddleware =(req,res,next)=>{
    //get token from req headers
    const token = req.headers['access-token']
    console.log(token);
    //verify token
  try { 
    const data= jwt.verify(token,'RussianSpy666')
    console.log(data);
    req.fromAcno = data.currentAcno
    console.log('Valid Token');
    next()
    }
  catch{
    console.log('Invalid Token');
    res.status(401).json({
        message:'Please Login'
    })
    }
   
}

//register api call resolving
server.post('/register',(req,res)=>{
console.log('Inside register function');
console.log(req.body);
//asynchronus
dataservice.register(req.body.uname,req.body.acno,req.body.pswd)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})

//login api call resolving
server.post('/login',(req,res)=>{
    console.log('Inside login Api');
    console.log(req.body);
//asynchronus
dataservice.login(req.body.acno,req.body.pswd)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})

//ge balance api
server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside getBalance Api');
    console.log(req.params.acno);
//asynchronus
dataservice.getBalance(req.params.acno)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})

//deposit api
server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside deposit Api');
    console.log(req.body);
//asynchronus
dataservice.deposit(req.body.acno,req.body.amount)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})

//fund Transfer api
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer Api');
    console.log(req.body);
//asynchronus
dataservice.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})

//getAllTransactions
server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('Inside getAllTransactions api');
    dataservice.getAllTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//delete-account api
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside delete-account Api');
    console.log(req.params.acno);
//asynchronus
dataservice.deleteMyAccount(req.params.acno)
.then((result)=>{
    res.status(result.statusCode).json(result)

})
})