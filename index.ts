import http, {IncomingHttpHeaders, IncomingMessage, ServerResponse} from "http";

const hostname = '127.0.0.1';
const port = 3000;

const parseRequestJsonBody = async (req: IncomingMessage) => {
    const buffers = []
    return new Promise(resolve => {
        req.on('data', (data) => {
            buffers.push(Buffer.from(data));
        })
        req.on('end', () => {
            const outputBuffer = Buffer.concat(buffers);
            try {
                resolve(JSON.parse(outputBuffer.toString()))
            } catch (e) {
                resolve(null)
            }
        })
    })
}

const parseMultipart = async (req: IncomingMessage) => {
    const buffers = []
    return new Promise(resolve => {
        req.on('data', (data) => {
            buffers.push(Buffer.from(data));
        })
        req.on('end', () => {
            const outputBuffer = Buffer.concat(buffers);
            try {
                resolve(outputBuffer.toString())
            } catch (e) {
                resolve(null)
            }
        })
    })
}

const contentTypeHeader = 'content-type'

enum CONTENT_TYPE {
    JSON = 'application/json',
    PLAIN = 'ext/plain',
    JS = 'application/javascript',
    FORM_DATA = 'multipart/form-data;'
}



class BodyParser {
    static async parse(headers: IncomingHttpHeaders, req: IncomingMessage) {
        console.log(headers)
        if(headers[contentTypeHeader] === CONTENT_TYPE.JSON) {
            return parseRequestJsonBody(req)
        }
        if(headers[contentTypeHeader].includes(CONTENT_TYPE.FORM_DATA)) {
            return parseMultipart(req)
        }
    }
}

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const body = await BodyParser.parse(req.headers, req)

    console.log(body)

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("success");
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});