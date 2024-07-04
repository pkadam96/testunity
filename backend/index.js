const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const allowedOrigins = ['http://localhost:5173', 'https://devtools-beta.vercel.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is running!");
});

app.post('/capture-requests', async (req, res) => {
    const { url } = req.body;
    const result = [];

    try {
        console.log('Launching Puppeteer...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        
        console.log(`Navigating to ${url}...`);
        await page.setRequestInterception(true);

        page.on('request', request => {
            request.continue();
        });

        page.on('response', async (response) => {
            const request = response.request();
            const responseHeader = response.headers();
            const requestHeader = request.headers();
            const request_url = request.url();
            const response_status = response.status();
            const response_type = response.headers()['content-type']; 
            const response_size = (await response.buffer()).length; 
            const request_method = request.method();
            const remote_address = `${request.url().split('/')[2]}`; 
            
            result.push({
                request_url,
                request_method,
                response_status,
                response_type,
                response_size,
                remote_address,
                requestHeader,          
                responseHeader
            });
        });

        await page.goto(url, { waitUntil: 'networkidle0' });
        await browser.close();

        console.log('Puppeteer process completed.');
        res.json(result);
    } catch (error) {
        console.error('Error capturing requests:', error);
        res.status(500).send('Error capturing requests');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
