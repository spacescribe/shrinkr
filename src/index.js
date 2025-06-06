const express=require('express');
const sequelize=require('./db');
const Url=require('./models/url');
const generateUniqueShortId = require('./utils/generateShortId');

require('dotenv').config()

const app=express();
app.use(express.json());
const port=process.env.PORT||3000;

app.post('/shorten', async(req, res)=>{
    try{
        const originalUrl = req.body.originalUrl;
        const shortId=await generateUniqueShortId();
        const url= await Url.create(
            {
                originalUrl: originalUrl,
                shortId: shortId
            }
        )
        res.status(200).json({shortUrl: `${req.headers.host}/${shortId}`})
    }
    catch (error){
        console.error(error.message)
        res.status(500).json({error: `Could not generate short url`})
    }
});

app.get('/:shortId', async (req, res)=>{
    const url=await Url.findOne({where: {shortId: req.params.shortId}});
    if(url){
        url.clickCount+=1
        await url.save();
        res.redirect(url.originalUrl);
    }else{
        res.status(404).send("Url not found")
    }
});

sequelize.sync().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server running on http://localhost:${port}`)
    });
})