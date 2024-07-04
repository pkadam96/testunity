const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is running!");
});

app.post('/capture-requests', async (req, res) => {
    const { url } = req.body;
    const result = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', request => {
        request.continue();
    });

    page.on('response', async response => {
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

    await page.goto(url, {
        waitUntil: 'networkidle0',
    });

    await browser.close();

    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
