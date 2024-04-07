import express from 'express';
import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import  UrlModel from './model.js'
const server = express();
server.set("view engine", "ejs");
server.use(express.json())
server.use(express.urlencoded({ extended: true }));
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/test`);
  console.log('DB Connected successfully ');
}
server.get('/', async(req, res) => {
    const shortUrls=await UrlModel.find()
    res.render('index', { shortUrls: shortUrls })
});
server.post('/posturl',async(req,res)=>{
    const nanoid = customAlphabet('1234567890abcdef', 10);
    await UrlModel.create({
        fullurl: req.body.fullUrl,
        shorturl: nanoid()
    })
    res.redirect('/')
})

server.get('/:shorturl',async(req,res)=>{
    const url=await UrlModel.findOne({shorturl:req.params.shorturl})
    if(url==null) res.status(404).json('url not-found')
    res.redirect(url.fullurl)
})

server.listen(2239, () => {
    console.log('server in 2239');
});
