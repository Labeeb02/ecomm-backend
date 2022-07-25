const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { application } = require('express')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const cartRouter = require('./routes/cart')
const striprRouter = require('./routes/stripe')
const cors = require('cors')

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const port=process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.log('Error:', err.message)
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/orders', orderRouter)
app.use('/api/checkout', striprRouter)
app.get('/', (req, res) => res.send('Hello World!'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))