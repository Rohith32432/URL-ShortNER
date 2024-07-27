import express from 'express';
import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import UrlModel from './model.js';
import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.set('views', './views');
server.set("view engine", "ejs");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

main().catch(err => console.log('DB Connection Error:', err));

async function main() {
  try {
    await mongoose.connect(process.env.url);
    console.log('DB Connected successfully');
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
}

server.get('/', async (req, res) => {
  try {
    const shortUrls = await UrlModel.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (err) {
    console.error('Error fetching short URLs:', err);
    res.status(500).send('Server Error');
  }
});

server.post('/posturl', async (req, res) => {
  try {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    await UrlModel.create({
      fullurl: req.body.fullUrl,
      shorturl: nanoid()
    });
    res.redirect('/');
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).send('Server Error');
  }
});

server.get('/:shorturl', async (req, res) => {
  try {
    const url = await UrlModel.findOne({ shorturl: req.params.shorturl });
    if (url == null) return res.status(404).json('URL not found');
    res.redirect(url.fullurl);
  } catch (err) {
    console.error('Error fetching URL:', err);
    res.status(500).send('Server Error');
  }
});

server.get('/del/:id', async (req, res) => {
  try {
    await UrlModel.deleteOne({ shorturl: req.params.id });
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(500).send('Server Error');
  }
});

export default server;
