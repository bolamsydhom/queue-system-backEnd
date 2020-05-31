require('dotenv').config();
const express = require('express');

const swaggerUi = require('swagger-ui-express');
const specs = require('./helpers/swagger');
// import * as specs from './helpers/swagger';

const port = process.env.port;
require('./db');

const fileUpload = require('express-fileupload');

const userRouter = require('./routes/user');
const productRouter = require('./routes/ticket');
const categoryRouter = require('./routes/category');
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.use('/user', userRouter);
app.use('/ticket', productRouter);



app.use('/category', categoryRouter);


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

app.listen(port, ()=>{
    console.log(`app listing on port :${port}`)
})
