'use strict';

var config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379
};

var redis = require("redis"),
    client = redis.createClient(config.port, config.host);

client.on("ready", function () {
    console.log("redis connection ready");
});
client.on("error", function (err) {
    console.log("Error " + err);
});

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var pubPromises = event.Records.map((record) => {
        return new Promise((resolve, reject) => {
            
            // Kinesis data is base64 encoded so decode here
            const data = Buffer.from(record.kinesis.data, 'base64').toString('ascii')
            
            client.publish("bans", data, (err, res) => {
                if(err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
    Promise.all(pubPromises)
        .then(res => { 
            console.log(`Redis responses: ${res}`);
            console.log(`Successfully processed ${event.Records.length} record(s).`);
            callback(null, event.Records.length); // Return number of records
        })
        .catch(reason => { 
            callback(reason)
        })
        .then(() => {
            client.quit();
            console.log('Redis connection closed');
        });
};