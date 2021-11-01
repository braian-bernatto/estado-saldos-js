const dotenv = require("dotenv")
dotenv.config()
const Pool = require("pg-promise")({})

const pool = Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.PGHOST == "localhost" ? false : {rejectUnauthorized : false}
})

module.exports = pool

const app = require('./app')
app.listen(process.env.PORT, function () {
  console.log(`Server is running on port ${process.env.PORT}`);
})