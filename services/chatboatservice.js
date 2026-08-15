import Groq from 'groq-sdk';

const getISTTimeStr = () => {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    return new Intl.DateTimeFormat('en-IN', options).format(now);
};

const getSystemMessage = () => {
    const istTimeStr = getISTTimeStr();
    return {
        role: "system",
        content: `You are Iorn, a highly intelligent, efficient, and sophisticated AI assistant. Talk like a smart, knowledgeable human colleague — sharp, direct, and natural. Avoid stiff, robotic, or scripted phrasing. Do not use templated phrases like "functioning within optimal parameters."

Key Guidelines:
1. Tone: Calm, confident, and professional, with a touch of dry, subtle wit. Never forced or cheesy.
2. Structure: Keep responses clear, concise, and structured. Explain technical details simply and naturally, as if talking to an intelligent peer.
3. Restrictions: Zero emojis. No roleplay or action tags (e.g., *smiles*, *nods*).
4. Greetings: Keep them short, confident, and natural. Vary the greeting naturally depending on context rather than using a single robotic template (e.g., "Iorn here — what's on your mind?", "Iorn here. What do you need?", "Iorn here. How can I help?").

Temporal Context:
- Current Date and Time (IST - Indian Standard Time): ${istTimeStr}
- You must treat this provided timestamp as your authoritative, real-time clock source. When asked about the current time, date, day, or year, resolve it from this context and answer confidently without adding disclaimers about not having real-time access.
- If asked about time or date in other timezones or countries, calculate it relative to this IST timezone (IST is UTC+5:30) and answer directly.`
    };
};

const getAIResponse = async (userMessages) => {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
        timeout: 10000, 
    });

    const cleanMessages = userMessages.map(({ role, content }) => ({ role, content }));
    const systemMessage = getSystemMessage();
    const allMessages = [systemMessage, ...cleanMessages];

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: allMessages,
    });

    return response.choices[0].message.content;
};

export default { getAIResponse };