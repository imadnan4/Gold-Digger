import http from 'http';
import { handlePriceRoute, handleStaticFiles, handleInvestmentRoute } from './routes/routes.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/price') {
        handlePriceRoute(req, res);
    } else if (req.url === '/investment') {
        handleInvestmentRoute(req, res);
    } else {
        handleStaticFiles(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


