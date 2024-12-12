const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const authJwt = require('./middleware/jwt');
const errorHandler = require('./middleware/error_handler');

const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*' , cors());
app.use(authJwt());
app.use(errorHandler);


const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const emissionRouter = require('./routes/emissions');

app.use(`${API}/` , authRouter);
app.use(`${API}/` , chatRouter);
app.use(`${API}/` , emissionRouter);

const hostname = env.HOST;
const port = env.PORT;

mongoose
.connect(env.MONGODB_local_CONNECTION_STRING)
.then(() => {
    console.log("Connected to DB!");
})
.catch((error) => {
    console.error(error);
});

app.listen(port , () =>{
    console.log(`Server running at http://${hostname}:${port}`);
});