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

app.use(body_parser.json())

app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(cookieParser());
app.use(express.static(path.join('.', '/static/')))

app.use('/api/users', users_router)
app.use('/api/question', question_router)
app.use('/api/answers', answers_router)
app.use('', page_router)


 const server_api = app.listen(config.server.port, () => {
     logger.info(`====== express server is running on port ${config.server.port} =======`);
 })

