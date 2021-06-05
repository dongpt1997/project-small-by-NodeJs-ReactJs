require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const connectDB = async () => {
    try {
        // await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern.3tflo.mongodb.net/mern?retryWrites=true&w=majority`,
        await mongoose.connect('mongodb://localhost:27017/myapp',
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
        console.log('ket noi thanh cong')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()

const app = express()
app.use(cors())
app.use(express.json())
// app.get('/', (req, res) => res.send('hello'))
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
const PORT = 5000
app.listen(PORT, () => console.log(`server chay tren cong ${PORT}`))