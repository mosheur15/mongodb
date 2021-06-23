const express = require("express");
const app = express();
require("./db/conn")
const router = require("./routers/student")

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})