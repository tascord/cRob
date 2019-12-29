const request = require('request');

module.exports = (fs) => {
    
    download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
            
            info(`Downloading File From URL: '${uri}'...
    File Type: ${res.headers['content-type']}
    File Size: ${res.headers['content-length']}`);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

}