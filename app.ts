import { sayHi } from "./src/tools.js";
import { EventEmitter } from "node:events";
import { createServer, IncomingMessage } from "node:http";
import { addUser, getAllUsers, getUser, updateUser, removeUser, User } from "./src/model/users.js";

console.log("Hello");
const myName: string = "Innokenty!";
sayHi(myName);

const myEventEmitter = new EventEmitter();

async function parseBody(req: IncomingMessage): Promise<any>{

    return new Promise((resolve, reject) =>{

        let body = "";

        req.on('data', (chunk) =>{
            body += chunk.toString();
        });

        req.on('end', () =>{

            try{
                resolve(JSON.parse(body))
            }catch (e){
                console.error("Invalid JSON received:", body);
                reject(new Error('Invalid json'));

            }
        });
    });
}

const myServer = createServer(async(req,res) =>{

    const { url, method } = req;

    if (!url){

        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end('Bad request: URL is undefined');
        return;
    }

    try{
        switch(true){

            case (url === "/" && method === "GET"):{

                res.writeHead(200, {'Content-Type': 'text/html'});

                res.end('Hello!');

                break;
            }

            case (url === "/api/users" && method === "POST"):{
                const body = await parseBody(req);
                const isSuccess = addUser(body as User);

                if (isSuccess){
                    res.writeHead(200, {'Content-Type': 'text/html'});

                    res.end('User was added');

                }else{

                    res.writeHead(409, {'Content-Type': 'text/html'});

                    res.end('User already exists');

                }
                break;
            }

            case (url === "/api/users" && method === "GET"): {
                const users = getAllUsers();
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(users));
                break;
            }

            case (url.startsWith("/api/users/") && method === "GET"):
            {
                const urlParts = url.split('/');
                const userId = parseInt(urlParts[urlParts.length - 1]);
                const user = getUser(userId);

                if (user){

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(user));

                }else{

                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('User not found');

                }
                break;
            }

            case (url === "/api/users" && method === "PUT"):{
                const body = await parseBody(req);
                const isSuccess = updateUser(body as User);

                if (isSuccess){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end('User updated');

                }else{

                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('User not found');

                }
                break;
            }

            case (url.startsWith("/api/users/") && method === "DELETE"):{

                const urlParts = url.split('/');
                const userId = parseInt(urlParts[urlParts.length - 1]);
                const removedUser = removeUser(userId);

                if (removedUser){

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(removedUser));

                }else{

                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('User not found');

                }
                break;
            }

            default:
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('Not found');
                break;

        }
    }catch (err){

        console.error("Error handling request:", err);
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('Internal server error');

    }
});

myServer.listen(3005,() =>{
console.log("Server run at http://localhost:3005/");
});
