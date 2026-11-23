import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API funcionando')
})

app.use('/api/auth', authRoutes)

conectarDB()

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})
