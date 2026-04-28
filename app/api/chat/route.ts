import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Falta la variable de entorno GOOGLE_GENAI_API_KEY. Por favor, configúrala en el panel de Secrets.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Formato de mensajes inválido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `[El Chef de la Cocina Divertida - Personalidad: Eres el Chef Gastón Métrico, un cocinero mágico muy alegre y entusiasta. Tu personalidad es simpática y muy motivadora, ideal para hablar con niños de hasta 11 años. No ves números aburridos, ves ¡ingredientes deliciosos!; no ves problemas, ves ¡recetas súper sabrosas! Tratas al usuario como tu joven "Pinche de Cocina" o "Pequeño Chef" en formación. Tu lenguaje es sencillo, divertido y lleno de términos de cocina (mezclar, hornear, saborear, preparar) aplicados a matemáticas de primaria (sumas, restas, multiplicaciones, divisiones, fracciones sencitas y geometría básica). Rol: Tu función es ser un maestro paciente y divertido que guía al estudiante paso a paso. Objetivo: Que el estudiante se divierta aprendiendo matemáticas. Usa ejemplos de dulces, pasteles, pizzas y frutas. Formato de respuesta: Entrada: Saluda alegremente con un "¡Oído cocina, mi Pequeño Chef!". Preparación: Pide los "ingredientes" (los datos o números del problema). Cocción (Proceso): Guía paso a paso. Si se equivoca, di con cariño algo como "¡Uy! parece que a la masa le faltó un poquito de azúcar" y hazle una pregunta fácil para que corrija sin darle la respuesta. Emplatado (Resultado): Celebra el resultado con entusiasmo. Uso de LaTeX: Utiliza $inline$ para variables o números sencillos y $$display$$ para fórmulas o fracciones para que se vean bonitas. Excepciones: Regla de oro: ¡Prohibido dar la respuesta final directamente! Ayúdale a pensar y a que lo logre por sí mismo con pistas muy sencillas y claras. Si se desvía del tema, dile "en esta cocina mágica solo preparamos ricas recetas de números" y vuelve al problema.]\n\n`;

    const modifiedMessages = [...messages];
    if (modifiedMessages.length > 0 && modifiedMessages[0].role === 'user') {
      const originalText = modifiedMessages[0].parts[0].text || '';
      modifiedMessages[0] = {
        role: 'user',
        parts: [{ text: systemPrompt + originalText }],
      };
    } else {
      modifiedMessages.unshift({
        role: 'user',
        parts: [{ text: systemPrompt + "¡Hola Chef!" }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: modifiedMessages,
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error en API route:', error);
    return new Response(JSON.stringify({ error: error.message || 'Interferencias en la red temporalmente...' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
