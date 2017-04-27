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


let errorObject = server.listen(port, function ()
{
    console.log("Server is listening on Port:" + port)

});


errorObject.on('error', function (err)
{
    if (err.code === "EACCES")
    {
        if(port <= 1024)
        {
            console.log("You have no permission to start this port\n");
        }
        else
        {
            console.log("You tried to start the server on a busy port\n");
        }

        console.log("Used Port is:\t" + port);
    }
    else
    {
        console.log("Something went terrible wrong!")
    }
    process.exit(1);
});
