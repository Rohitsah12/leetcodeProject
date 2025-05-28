const  { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15119.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15119
    }
});

module.exports=redisClient;