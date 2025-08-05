import express from 'express';
import { GoogleGenerativeAI } from '@google/genai';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json());

// Inicializa Gemini con la clave de API desde una variable de entorno segura
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint para el chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).send({ error: 'El mensaje es requerido' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;

    res.send({ reply: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});

// Aquí añadirías otro endpoint para la "Captura Mágica"

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});