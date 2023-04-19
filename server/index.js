const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const Post = require('./models/Post')

const fs = require('fs')

const uploadMiddleWare = multer({dest: 'uploads/'})


const salt = bcrypt.genSaltSync(10)
const secret = 'ajgwuuwebebfiowjdnd' // for jwt 

app.use(cors({credentials:true,origin:'http://localhost:3000'}))
// app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'))


mongoose.connect('mongodb+srv://tushar:1234@cluster0.1zcwwth.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res)=>{
    const {username,password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt)
        });
        res.json(userDoc)
    }catch(e) {
        res.status(400).json(e)
    }
})

app.post('/login', async (req,res) => {
 const {username,password} = req.body;
 console.log(username)

 try {
 const userDoc = await User.findOne({username});
 const passOk = bcrypt.compareSync(password,userDoc.password)
 
 if (passOk) {
    jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
        if (err) throw err;
        res.cookie('token',token).json({
            id:userDoc._id,
            username,
        });
    })
 } else {
    res.status(400).json('wrong credentials!')
 }
 } catch(e) {
    console.log(e);
    res.status(400).json(e)
 }
})

app.get('/profile',(req,res)=>{

    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info) => {
        if (err) throw err
        res.json(info)
    })
})

app.post('/logout', (req,res) => {
    res.cookie('token','').json('ok')
})


app.post('/post',uploadMiddleWare.single('file'),async (req,res) => {
 // argument in single() should be same as in data
    const {originalname,path} = req.file;
    const parts = originalname.split('.')
    const ext = parts[parts.length-1]
    const newPath = path+'.'+ext
    fs.renameSync(path,newPath);

    const {token} = req.cookies;

    jwt.verify(token,secret,{},async (err,info) => {
        if(err) throw err;

        const {title,summary,content} = req.body
        const postDoc =await Post.create({
            title,summary,content,
            cover:newPath,
            author:info.id
        })
        res.json(postDoc)
    })


})

app.get('/post',async (req,res) => {
    const posts = await Post.find().populate('author',['username'])
    .sort({createdAt: -1})
    .limit(20); 
    res.json(posts)
})

app.get('/post/:id',async (req,res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc)
})

app.put('/post',uploadMiddleWare.single('files'),async (req,res)=> {
    
    let newPath = null
    console.log('updating')
    console.log(req.body)
    if (req.body.files) {
        const {originalname,path} = req.body.files;
        const parts = originalname.split('.')
        const ext = parts[parts.length-1]
        console.log(ext)
        newPath = path+ '.' +ext
        console.log(newPath)
        fs.renameSync(path,newPath);
    }

    const {token} = req.cookies

    jwt.verify(token,secret,{},async (err,info) => {
        if(err) throw err;

        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id)

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if (!isAuthor) {
            res.status(400).json('you are not the author')
            throw 'you are not the author';
        }

        await Post.findOneAndUpdate({
            _id: id 
        },{

            title,
            summary,
            content,
            cover: newPath? newPath : postDoc.cover

        })
        res.json(postDoc)
    })
})

app.listen(4000,()=>console.log('listening on 4000'));