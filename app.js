const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const router = require('./routes/api');
const app = express();
const port = process.env.PORT || 5000;

//Middleware, To exchange between two domain different each other
app.use(cors());
app.use(express.json());

// read file .env
dotenv.config();

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Route
// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.use('/api', router);