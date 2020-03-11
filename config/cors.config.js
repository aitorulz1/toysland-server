const cors = require('cors')

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // origin es la api que en .env declaro 3001 || esta segunda dice que la api el front sea en el puerto 3000. Ahora no hay conflicto
  allowedHeaders: ['Content-Type', 'Origin'],
  credentials: true
})

module.exports = corsMiddleware