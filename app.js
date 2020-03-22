let http = require('http');
let path = require('path')
let fs = require('fs')
let { parse } = require('querystring');

const POST = 3000;


const app = http.createServer((request, response) => {
    if (request.url === '/message' || request.url === '/') {
        if (request.method === 'POST') {
            messageFromForm(request, result => {
                let { message } = result;
                message = message.toUpperCase()
                console.log(message)
                fs.appendFile('message.txt', message + ', ', error => {
                    if (error) throw error;
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(`The message you entered is '${message}'`)
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
        response.end('page not found');
    }
})



app.listen(POST, () => {
    console.log('server started on port: ', POST)
});

let messageFromForm = (request, cb) => {
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