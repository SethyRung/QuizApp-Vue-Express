module.exports = {
  port: '8081',
  db: {
    database: 'quizzes',
    user: 'root',
    password: 'Rs123451@',
    options: {
      dialect: 'mysql',
      host: 'localhost'
    }
  },
  allowedOrigins: ['http://192.168.203.177:5173', 'http://localhost:5173']
}
