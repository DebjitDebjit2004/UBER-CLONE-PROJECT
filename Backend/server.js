const http = require('http');
const app = require('./app');

// Set the port
const port = process.env.PORT || 3000;

// Create a server
const server = http.createServer(app);

// Listen to the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});