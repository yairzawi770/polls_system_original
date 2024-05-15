const express = require('express')
const body_parser = require('body-parser')
const config = require('config')
const cors = require('cors')
const path = require('path')
const users_router = require('./routers/users_router')
const question_router = require('./routers/question_router')

const app = express()

app.use(body_parser.json())

app.use(cors())

app.use(express.static(path.join('.', '/static/')))

app.use('/api/users', users_router)
app.use('/api/question', question_router)


 const server_api = app.listen(config.server.port, () => {
     console.log(`====== express server is running on port ${config.server.port} =======`);
 })

