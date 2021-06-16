const fs = require("fs")
const Server = require("kando-server");
const Router = require("kando-router");
const rC = require("./config/routerConfig");
const sC = require("./config/serverConfig");
const localEmitter = require("./localEmitter")

// config dotenv and set path 
require("dotenv").config({
    path:"./config/.env"
})

// set a local emmiter for server to emmit that router listen to event  
sC.serverConfig.eventEmitter = localEmitter
rC.routerConfig.eventEmitter = localEmitter

// config router and server
const router = new Router(rC.routerConfig);
const server = new Server(sC.serverConfig);

// start our server
server.start()
loadServices();

// load service and their routes for set to addRoute method in our router   
function loadServices(){
    const serviceName = fs.readdirSync("./services")
    serviceName.forEach(serviceName => {
        const service = require(`./services/${serviceName}`);
        Object.keys(service.routes).forEach(route=>{
            Object.keys(service.routes[route]).forEach(method=>{
                const routeObj = {
                    route , 
                    method,
                    function:service.routes[route][method].function,
                    middlewares : service.routes[route][method].middlewares
                }
               
                router.addRoute(routeObj);
               
            });
        });
    });
   
}

