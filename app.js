const express = require('express')
const body_parser = require('body-parser')
const config = require('config')
const cors = require('cors')
const path = require('path')
const users_router = require('./routers/users_router')
const question_router = require('./routers/question_router')
const answers_router = require('./routers/answer_router')
const page_router = require ('./routers/page_router')
const logger = require('./logger/my_logger')
const cookieParser = require('cookie-parser')
const app = express()
const swaggerJsdoc = require('swagger-jsdoc')
app.use(body_parser.json())

app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(cookieParser());
app.use(express.static(path.join('.', '/static/')))

const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "My REST API employee",
        },
        servers: [
            {
                url: "/",
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);
app.use('/api/users', users_router)
app.use('/api/question', question_router)
app.use('/api/answers', answers_router)
app.use('', page_router)


 const server_api = app.listen(config.server.port, () => {
     logger.info(`====== express server is running on port ${config.server.port} =======`);
 })

