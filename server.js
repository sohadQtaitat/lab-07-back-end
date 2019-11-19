'use strict'

// dependecies (express , cors ,dotenv)


require('dotenv').config();

const express = require ('express');
const cors = require ('cors');

const PORT = process.env.PORT || 3000;

const server = express();

server.get('/location', (req,res)=> {
    res.status(200).send (' I am alive .');
});
server.listen(PORT ,() => console.log ('hello from port' , PORT));