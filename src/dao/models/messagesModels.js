import mongoose from 'mongoose';
const chatCollection = 'message';

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true }
});



export const messageModel =  mongoose.model(chatCollection, messageSchema);
