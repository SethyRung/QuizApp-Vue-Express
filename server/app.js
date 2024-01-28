require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const express_fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')
const https = require('https')

const corsOptions = require('./configs/corsOptions')
const credentials = require('./middleware/credentials')
const { sequelize } = require('./models')
const config = require('./configs/config')
const auth = require('./routes/auth')
const refresh = require('./routes/refresh')
const category = require('./routes/category')
const quiz = require('./routes/quiz')
const user = require('./routes/user')
const admin_user = require('./routes/admin/user')
const admin_quiz = require('./routes/admin/quiz')
const admin_category = require('./routes/admin/category')
const verifyJWT = require('./middleware/verifyJWT')
const verifyRoles = require('./middleware/verifyRoles')
const ROLES_LIST = require('./configs/roles_list')
const validateFile = require('./middleware/validateFile')
const uploadFile = require('./middleware/uploadFile')

const app = express()
app.use(morgan('combined'))

app.use(credentials)
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

//route
app.use('/auth', auth)
app.use('/refresh', refresh)
app.use('/category', verifyJWT, category)
app.use('/quiz', verifyJWT, quiz)
app.use('/user', verifyJWT, user)
app.use('/admin/user', verifyJWT, verifyRoles(ROLES_LIST.Admin), admin_user)
app.use('/admin/category', verifyJWT, verifyRoles(ROLES_LIST.Admin), admin_category)
app.use('/admin/quiz', verifyJWT, verifyRoles(ROLES_LIST.Admin), admin_quiz)
app.use(
  '/upload',
  verifyJWT,
  express_fileUpload({ createParentPath: true }),
  validateFile(['.png', '.svg'], 5 * 1024 * 1024),
  uploadFile('images')
)

app.use('/public', express.static('public'))

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
//   },
//   app
// )

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(config.port)
  })
  .catch((err) => {
    console.log(err)
  })
