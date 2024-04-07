import mongoose from 'mongoose';
const urlSchema = mongoose.Schema({
    fullurl: { type: String, required: true },
    shorturl: String 
});

export default  mongoose.model('Url', urlSchema);;
