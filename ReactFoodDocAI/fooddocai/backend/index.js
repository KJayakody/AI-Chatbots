const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const upload = multer();

const configuration = new Configuration({
    apiKey: 'Ysk-proj-6PAGsHr5x615t3iF5NxKT3BlbkFJq9vpyrVPa4EJYrd0YfSk',
});
const openai = new OpenAIApi(configuration);

let storedContent = '';

app.use(bodyParser.json());

app.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const dataBuffer = req.file.buffer;
        const pdfData = await pdfParse(dataBuffer);
        storedContent = pdfData.text;  // Store the extracted text
        res.json({ text: pdfData.text });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/scrape-website', async (req, res) => {
    try {
        const { url } = req.body;
        const response = await axios.get(url);
        storedContent = response.data;  // Store the website content
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const prompt = `Context: ${storedContent}\n\nQ: ${message}\nA:`;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });
        res.json({ reply: response.data.choices[0].text });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
