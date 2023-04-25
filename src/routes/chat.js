import express from 'express'

const chatRouter = express.Router();


chatRouter.get ('/',(req,res)=>{
 
    res.render('index',{})

});

export default chatRouter