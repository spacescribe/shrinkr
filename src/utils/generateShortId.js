const Url=require('../models/url')

async function generateUniqueShortId(len=6, maxRetries=5) {
    let attempt=0;
    let shortId;

    while(attempt<maxRetries){
        shortId=Math.random().toString(36).substring(2, len+2)

        const existing=await Url.findOne({where: {shortId: shortId}})
        if(!existing)
            return shortId;
        attempt++;
    }
    throw new Error("Failed to generate unique shortId after multiple attempts");
}

module.exports=generateUniqueShortId;