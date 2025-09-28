import { NextApiRequest, NextApiResponse } from 'next';

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'shortness of breath',
  'severe pain',
  'unconscious'
];

function detectEmergency(input) {
  const text = (input || '').toLowerCase();
  return EMERGENCY_KEYWORDS.some(k => text.includes(k));
}

const SYSTEM_PROMPT = `You are a professional, friendly, empathetic healthcare assistant.
Simulate a doctor consultation dynamically:
- Collect patient's Name, Age, Gender, How they are feeling, Main symptoms, Severity, Duration, Associated symptoms, Past medical history, Allergies, and current medications.
- Ask any additional questions needed to provide safe and accurate recommendations.
- Use the patient's name in replies once known.
- Provide only safe general advice: hydration, rest, diet, safe OTC medicines (paracetamol, ibuprofen).
- Detect emergencies: if user mentions dangerous symptoms (chest pain, difficulty breathing, severe pain, unconsciousness), alert immediately: "This may be an emergency. Seek urgent medical help immediately."
- Keep context memory of all previous replies.
- Provide a comprehensive final summary after all info is collected including:
  1. Patient profile
  2. Symptoms & severity
  3. Likely condition / general explanation
  4. Recommended OTC medications
  5. Dietary recommendations
  6. Precautions & lifestyle advice
  7. Follow-up instructions
- Respond in the same language the patient uses (English, Hindi, Punjabi).
- Keep a friendly, empathetic tone.
- Never provide prescription-only medicines or a formal diagnosis.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  // Emergency short-circuit
  if (detectEmergency(message)) {
    return res.status(200).json({ reply: '⚠️ This may be an emergency. Please seek urgent medical help immediately.' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback safe response if key not configured
      return res.status(200).json({
        reply:
          'Hello! I can help with general health guidance. Please share your name, age, gender, your main symptoms, severity, duration, any associated symptoms, past medical history, allergies, and current medications.'
      });
    }

    // Build messages including short history
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn.user) messages.push({ role: 'user', content: turn.user });
        if (turn.bot) messages.push({ role: 'assistant', content: turn.bot });
      }
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return res.status(200).json({
        reply:
          'Thanks for your message. I am temporarily unavailable. Meanwhile, please share your name, age, gender, symptoms, severity, and duration so I can help next.'
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ reply: content || 'Thank you. Could you provide more details about your symptoms and their duration?' });
  } catch (e) {
    console.error('Assistant error:', e);
    return res.status(200).json({
      reply:
        'Sorry, there was an issue processing your request. Please provide your name, age, gender, main symptoms, severity, and duration.'
    });
  }
}


