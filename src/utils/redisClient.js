const redis=require('redis');

const client=redis.createClient({
    url: 'redis://redis:6379',
})

client.on('error', (err)=>console.error('Redis Client Error', err));
client.connect()

module.exports=client;