const express = require("express");
const morgan  = require("morgan")
const app     = express();
const router  = require("./routers/student")
require("./db/conn")

// info: get http port from env var.
// if not found use 8000
const port = process.env.PORT || 8000;

// info: middlewares
app.use(express.json());
app.use(morgan('dev'))

// info: morgan is used to console log request.

// GET /students 201 532.067 ms - 2
// POST /students 400 189.311 ms - 1021
// PUT /students 404 32.613 ms - 147

// you will see messages like this after request.

// info: routers
app.use(router);

// info: listen for incomming connections.
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})