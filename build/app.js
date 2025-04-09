var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sayHi } from "./src/tools.js";
import { EventEmitter } from "node:events";
import { createServer } from "node:http";
import { addUser, getAllUsers } from "./src/model/users.js";
console.log("Hello");
const myName = "Innokenty!";
sayHi(myName);
const myEventEmitter = new EventEmitter();
const myServer = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, method } = req;
    function parseBody(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    }
                    catch (e) {
                        reject(new Error('Invalid json'));
                    }
                });
            });
        });
    }
    switch (url + method) {
        case "/" + "GET": {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Hello!');
            break;
        }
        case "/api/users" + "POST": {
            const body = yield parseBody(req);
            const isSuccess = addUser(body);
            if (isSuccess) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('User was added');
            }
            else {
                res.writeHead(409, { 'Content-Type': 'text/html' });
                res.end('User already exists');
            }
            break;
        }
        case "/api/users" + "GET": {
            const users = getAllUsers();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
            break;
        }
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Not found');
            break;
    }
}));
myServer.listen(3005, () => {
    console.log("Server run at http://localhost:3005/");
});
