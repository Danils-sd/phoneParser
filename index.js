const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const PORT = process.env.PORT || 5010;
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const parsePhoneNumbers = (html) => {
    const regExp = /(\+7|8)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g;
    const $ = cheerio.load(html);
    const text = $('body').text();
    
    const phoneNumbers = text.match(regExp) || [];

    return phoneNumbers.map(phone => {
        const cleanNumber = phone.replace(/D/g, '');

        if (cleanNumber.length === 10) {
            return `8${cleanNumber}`;
        } else if (cleanNumber.length === 11 && cleanNumber.startsWith('7')) {
            return `8${cleanNumber.slice(1)}`;
        } else {
            return cleanNumber;
        }
    });
};

app.post('/parse', (req, res) => {
    const url = req.body.src;

    request(url, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const phoneNumbers = parsePhoneNumbers(html);
            console.log(phoneNumbers)
            res.json({
                src: url,
                numbers: phoneNumbers
            });
        } else {
            res.status(500).json({ error: 'Error parsing webpage' });
        }
    });
});


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})