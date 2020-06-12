require('dotenv').config();
const express = require('express');

const swaggerUi = require('swagger-ui-express');
// import * as swaggerDocument from './helpers/swagger.json';
const specs = require('./helpers/swagger');
// import * as specs from './helpers/swagger';
var serveStatic = require('serve-static')

const port = process.env.PORT || 8000;
require('./db');

const fileUpload = require('express-fileupload');
var path = require('path')

const userRouter = require('./routes/user');
const ticketRouter = require('./routes/ticket');
const categoryRouter = require('./routes/category');
const cityRouter = require('./routes/city');
const organizationRouter = require('./routes/organization');
const branchRouter = require('./routes/branch');

const app = express();



const cors = require('cors');

app.use(fileUpload({
    useTempFiles: true
}));

app.use(express.json({
    extended: true
}));

app.use(express.urlencoded({
    extended: true
}
));

app.use((req, res, next) => {
    console.log('request url:', req.url);
    console.log('request Method:', req.method);
    console.log('Time:', Date.now())
    next()
})
app.use(cors());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.use('/user', userRouter);
app.use('/ticket', ticketRouter);
app.use('/category', categoryRouter);
app.use('/city', cityRouter);
app.use('/organization',organizationRouter);
app.use('/branch',branchRouter);

app.use(serveStatic(path.join(__dirname, 'dist')))


app.use((err,req,res,next)=>{
    console.error(err);
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
     res.status(statusCode).json({
            message: 'Sorry!! something went wrong',
            type: "INTRNAL_SERVER_ERROR",
            details:[]
        });
        
    }

    res.status(statusCode).json({
        message: err.message,
        type: err.type,
        details: err.details
    });
});

const server = app.listen(port)
// app.listen(port, ()=>{
//     console.log(`app listing on port :${port}`)
// })
const io = require('./socket').init(server);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    });
});