const express = require("express");
const app = express();
const cors = require('cors')

// Parse application/json
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors())

//Gemini api use
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

//acces routes
app.post('/gemini', async (req, res) => {
    const model = geminiAI.getGenerativeModel({model: "gemini-pro"})
    const chat = model.startChat({
        history: req.body.history
    });
    const message = req.body.message;
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.send(text);
})

const PORT = 8555;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
