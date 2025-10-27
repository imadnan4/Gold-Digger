import fs from 'fs';
import path from 'path';
import { getRandomPrice } from '../utils/randomPrice.js';
import { getPublicPath, getContentType } from '../utils/fileHandler.js';

export const handlePriceRoute = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ price: getRandomPrice() }));
};

export const handleStaticFiles = (req, res) => {
    const publicPath = getPublicPath();
    let filePath = path.join(publicPath, req.url === '/' ? 'index.html' : req.url);
    const contentType = getContentType(filePath);

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Serve custom 404 page
                const notFoundPath = path.join(publicPath, '404.html');
                fs.readFile(notFoundPath, (err, notFoundContent) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('404 Not Found', 'utf-8');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(notFoundContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

export const handleInvestmentRoute = (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { investment } = JSON.parse(body);
                const currentPrice = getRandomPrice();
                const ounces = investment / currentPrice;
                const roundedOunces = Math.round(ounces * 100) / 100;

                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({
                    investment: investment,
                    pricePerOz: currentPrice,
                    ounces: roundedOunces
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
};
