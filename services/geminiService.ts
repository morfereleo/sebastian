import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData, ChatMessage } from "../types";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const SYSTEM_INSTRUCTION = `Eres "CUADRAI", un experto consultor fiscal y de negocio para autónomos y freelancers en España. 
Tu personalidad es la de un "copiloto fiscal silencioso pero atento": profesional, cercano y, sobre todo, tranquilizador.
Tu misión es hacer la vida del autónomo más fácil. Evita la jerga fiscal compleja y traduce todo a un lenguaje que cualquiera pueda entender.
Responde de forma concisa y clara, usando listas o puntos clave para que la información sea fácil de digerir.
Cuando un usuario te pregunte algo, no solo respondas, anticípate a su siguiente pregunta. Dale contexto y explícale por qué es importante.
Ejemplo: si preguntan si un gasto es deducible, no digas solo "sí", explica "Sí, es deducible porque está directamente relacionado con tu actividad. Asegúrate de tener siempre la factura completa para poder justificarlo ante Hacienda."
Tu objetivo no es solo dar datos, es dar tranquilidad. Siempre debes basar tus respuestas en la normativa fiscal y mercantil española vigente.
No des consejos de inversión ni opiniones personales. Céntrate en la gestión del negocio y la fiscalidad del autónomo.`;

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    documentType: {
      type: Type.STRING,
      description: "Tipo de documento: 'invoice' (factura emitida a un cliente) o 'expense' (gasto o factura recibida de un proveedor).",
      enum: ["invoice", "expense"],
    },
    vendorOrClient: {
      type: Type.STRING,
      description: "Nombre del proveedor (si es gasto) o del cliente (si es factura emitida).",
    },
    date: {
        type: Type.STRING,
        description: "Fecha del documento en formato AAAA-MM-DD."
    },
    totalAmount: {
        type: Type.NUMBER,
        description: "El importe total final del documento."
    },
    subtotal: {
        type: Type.NUMBER,
        description: "La base imponible o subtotal antes de impuestos."
    },
    ivaAmount: {
        type: Type.NUMBER,
        description: "El importe total del IVA. Si hay varios tipos, súmalos. Si no existe, es 0."
    },
    irpfAmount: {
        type: Type.NUMBER,
        description: "El importe de la retención de IRPF. Si no existe, es 0."
    },
    invoiceId: {
        type: Type.STRING,
        description: "El número o identificador de la factura. Si no es una factura, puede ser null."
    },
    lineItems: {
        type: Type.ARRAY,
        description: "Lista de conceptos o productos. Si no se detallan, crea uno genérico.",
        items: {
            type: Type.OBJECT,
            properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                price: { type: Type.NUMBER }
            }
        }
    },
    category: {
        type: Type.STRING,
        description: "Si es un gasto, sugiere una categoría contable (ej. Suministros, Marketing, Software, Dietas)."
    }
  },
  required: ["documentType", "vendorOrClient", "date", "totalAmount", "subtotal", "ivaAmount"]
};


export async function getFinancialAdvice(prompt: string, history: ChatMessage[], profileContext: string): Promise<string> {
  if (!API_KEY) {
    return Promise.resolve("El servicio de consulta no está disponible en este momento. Por favor, asegúrese de que la clave de API esté configurada.");
  }

  try {
    // We add the profile context to the system instruction to make the AI aware.
    const contextualizedSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n${profileContext}`;
    
    const geminiHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));


    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: contextualizedSystemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
      history: geminiHistory.slice(0, -1) // Pass history without the last user message, which is the new prompt
    });

    const response = await chat.sendMessage({ message: prompt });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching financial advice from Gemini:", error);
    return "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo más tarde.";
  }
}


export async function extractDataFromImage(base64Image: string, mimeType: string, prompt: string): Promise<ExtractedData> {
    if (!API_KEY) {
        throw new Error("El servicio de extracción no está disponible. La clave de API no está configurada.");
    }

    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analiza la imagen de esta factura o ticket. Extrae los datos clave según el schema JSON proporcionado. El usuario ha añadido esta nota: "${prompt}"`
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: "Eres un experto en OCR y extracción de datos de facturas y tickets españoles. Tu única función es analizar la imagen y rellenar el schema JSON con la mayor precisión posible. No respondas con texto plano, solo con el JSON.",
                responseMimeType: "application/json",
                responseSchema: EXTRACTION_SCHEMA,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ExtractedData;
    } catch (error) {
        console.error("Error extracting data from image with Gemini:", error);
        throw new Error("No se pudieron extraer los datos de la imagen. Por favor, comprueba que la imagen sea nítida e inténtalo de nuevo.");
    }
}