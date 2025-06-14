const express=require('express');
const promBundle=require('express-prom-bundle');
const sequelize=require('./db');
const Url=require('./models/url');
const generateUniqueShortId = require('./utils/generateShortId');
const redisClient=require('./utils/redisClient')

const registy=promBundle({includeMethod: true, includePath: true});
const client=require('prom-client');

require('dotenv').config()

const app=express();
app.use(express.json());
app.use(registy);
const port=process.env.PORT||3000;

const urlShortenCounter= new client.Counter({
    name: 'shrinkr_urls_shortened_count',
    help: 'Total number of URLs shortened',
})

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
        await redisClient.set(shortId, originalUrl);

        urlShortenCounter.inc();
        res.status(200).json({shortUrl: `${req.headers.host}/${shortId}`})
    }
    catch (error){
        console.error(error.message)
        res.status(500).json({error: `Could not generate short url`})
    }
});

app.get('/:shortId', async (req, res)=>{
    const shortId = req.params.shortId;
    try{
        const cachedUrl=await redisClient.get(shortId);
        if(cachedUrl){
            console.log('Cache hit')
            return res.redirect(cachedUrl)
        }

        const url=await Url.findOne({where: {shortId: shortId}});
        if(url){
            await redisClient.set(shortId, url.originalUrl)
            url.clickCount+=1
            await url.save()
            
            return res.redirect(url.originalUrl);
        }else{
            res.status(404).send("Url not found");
        }
    }catch(err){
        console.error(err.message);
        res.status(500).send("Internal server error")
    }
});

sequelize.sync().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server running on http://localhost:${port}`)
    });
})