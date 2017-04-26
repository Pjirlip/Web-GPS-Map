/**
 * Created by Philipp on 24.04.17.
 */

let express = require('express');
let app = express();

app.get("/", function (request, responds)
{
        responds.sendfile("../index-.html");
});


