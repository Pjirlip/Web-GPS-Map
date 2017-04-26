/**
 * Created by Philipp on 24.04.17.
 */

const express = require('express');
const server = express();
const port = getPortFromArguments();

const router = express.Router();


function getPortFromArguments()
{

    let port = process.argv[2];
    if (!Number.isInteger(port) && !(port >= 1 && port <= 65535))
    {
        port = 8080;
    }

    return port;
}

router.get("/", function (request, responds)
{
    responds.sendfile("./src/index.html");
});

server.use("/", router);


server.listen(port, function ()
{
    console.log("Server is listening on Port:" + port)


});


process.on('uncaughtException', function (err)
{
        console.log(err);
        process.exit(1);
});