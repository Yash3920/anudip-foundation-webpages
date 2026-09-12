/* =========================================================
   Vercel Serverless Function: /api/chat
   ========================================================= */

const ANUDIP_KNOWLEDGE = `
You are the AI assistant on the Anudip Foundation website, an Indian NGO
(founded 2007, Kolkata) that trains marginalised youth and women in digital
and vocational skills and helps place them in jobs.

Key facts: 7,30,000+ learners trained, 53% women, 90+ centres across 22
Indian states and 3 countries, 70% job placement rate, 300% average rise in
family income, 400+ corporate hiring partners (Accenture, Infosys, Axis
Bank, Capgemini, IndiGo, HCLTech, Zomato, iMerit).

Courses: Web Development with React, Python, Java Full-Stack, AWS, Data
Analytics, Digital Marketing, Graphic Design, Accounting with Tally Prime,
English Communication & IT — most priced at ₹1,000.

Tracks: DeepTech (advanced software), Diya (foundations for at-risk youth),
FuturePro (ICT literacy), AI Academy (applied AI).

Contact: Mira Towers, Sector V, Salt Lake, Kolkata 700091.
Phone +91 33 2357 7406. Email connect@anudip.org.

Answer in 2-4 sentences unless more detail is asked for. If a question is
unrelated to Anudip Foundation, politely redirect. If unsure of a detail,
say so and suggest emailing connect@anudip.org.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing API Key in Vercel Environment Variables.' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://anudip-foundation.vercel.app', 
        'X-Title': 'Anudip Foundation Website'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'system', content: ANUDIP_KNOWLEDGE }, ...messages]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
