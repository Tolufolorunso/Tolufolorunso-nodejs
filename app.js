let http = require('http');
let path = require('path')
let fs = require('fs')
let { parse } = require('querystring');

const POST = 3000;


const app = http.createServer((request, response) => {
    if (request.url === '/message' || request.url === '/') {
        if (request.method === 'POST') {
            dataCollected(request, result => {
                const { message } = result;
                console.log(message)
                fs.appendFile('message.txt', message + ', ', error => {
                    if (error) throw error;
                    response.end(`The message you enter is ${message}`)
                })
            })
        } else {
            fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
                if (err) throw err;
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data)
            });
        }
    } else {
        response.statusCode = 404;
        response.end('404 Page');
    }
})



app.listen(POST, () => {
    console.log('server started on port: ', POST)
});

let dataCollected = (request, cb) => {
    const FORMENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORMENCODED) {
        let body = '';
        request.on('data', function (data) {
            body += data.toString();
        });
        request.on('end', () => {
            cb(parse(body))
        });
    } else {
        cb(null);
    }
}