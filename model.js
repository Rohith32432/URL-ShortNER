import mongoose from 'mongoose';
const urlSchema = mongoose.Schema({
    fullurl: { type: String, required: true },
    shorturl: String ,
    createdAT: { type: Date, default: Date.now }
});

export default  mongoose.model('Url', urlSchema);;
