const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importa body-parser
const app = express();
const axios = require('axios');

app.use(cors({
  origin: 'http://localhost:4200'
}));

// Configura body-parser para manejar JSON y datos de formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes and corresponding microservices
const routes = [
  {
    id: 'product',
    uri: 'http://localhost:8090',
    prefix: '/api/product',
  },
  {
    id: 'category',
    uri: 'http://localhost:9090',
    prefix: '/api/category',
  },
  {
    id: 'factura',
    uri: 'http://localhost:9080',
    prefix: '/api/factura',
  },
  {
    id: 'detalleFactura',
    uri: 'http://localhost:9080',
    prefix: '/api/detalleFactura'
  }
];

// Loop through routes and create middleware for each
routes.forEach(route => {
  app.use(route.prefix, async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${route.uri}${req.originalUrl}`,
        data: req.body,
        headers: req.headers,
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
});

// Error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
