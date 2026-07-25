import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazy/safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: AI Weather Executive Briefing
  app.post('/api/ai-briefing', async (req, res) => {
    try {
      const { locationName, country, current, dailySummary } = req.body;

      if (!locationName || !current) {
        return res.status(400).json({ error: 'Missing required weather parameters.' });
      }

      const prompt = `
You are a senior meteorologist and lifestyle AI advisor. Provide an executive weather briefing and planning summary for ${locationName}${country ? `, ${country}` : ''}.

Current Weather Data:
- Temperature: ${current.temperature}°C (Feels like ${current.apparentTemperature}°C)
- Condition Code: ${current.weatherCode}
- Humidity: ${current.humidity}%
- Wind Speed: ${current.windSpeed} km/h
- UV Index: ${current.uvIndex}
- Precipitation: ${current.precipitation} mm

Upcoming 3-Day Forecast Highlights:
${JSON.stringify(dailySummary || [], null, 2)}

Provide a structured response in pure JSON format matching this exact schema:
{
  "summary": "A 2-sentence executive summary highlighting the general weather vibe today.",
  "highlights": [
    "Key atmospheric highlight 1 (e.g. UV exposure or wind gust peak)",
    "Key highlight 2 (e.g. temperature trend or evening chill)",
    "Key highlight 3 (e.g. rain window or clear sky outlook)"
  ],
  "outdoorAdvice": "Specific actionable advice for outdoor plans, sports, and commute.",
  "clothingTip": "Detailed wardrobe layering and gear recommendation.",
  "travelWarning": "Optional caution note if high wind, storm, or extreme temperature exists, else empty string."
}
Only output valid JSON without markdown codeblock backticks if possible, or plain clean JSON.
`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      let parsed = {};
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        parsed = {
          summary: text,
          highlights: ['Check local forecasts before traveling.'],
          outdoorAdvice: 'Stay hydrated and dress in comfortable layers.',
          clothingTip: 'Adapt clothing to temperature variations throughout the day.',
          travelWarning: '',
        };
      }

      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating AI briefing:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate AI weather briefing.',
      });
    }
  });

  // API Route: AI Weather Assistant Chat
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { userQuestion, weatherContext, history } = req.body;

      if (!userQuestion) {
        return res.status(400).json({ error: 'User question is required.' });
      }

      const systemInstruction = `
You are Weather Intelligence AI, an expert meteorologist and outdoor planning assistant.
You have access to the user's current local weather context:
Location: ${weatherContext?.locationName || 'Unknown'}
Temperature: ${weatherContext?.current?.temperature ?? 'N/A'}°C (Feels like ${weatherContext?.current?.apparentTemperature ?? 'N/A'}°C)
Humidity: ${weatherContext?.current?.humidity ?? 'N/A'}%
Wind: ${weatherContext?.current?.windSpeed ?? 'N/A'} km/h
UV Index: ${weatherContext?.current?.uvIndex ?? 'N/A'}
Weather Code: ${weatherContext?.current?.weatherCode ?? 'N/A'}

Answer the user's question concisely, helpfully, and with direct reference to these weather conditions. Give practical advice regarding clothing, safety, timing, travel, sports, or outdoor events. Keep answers engaging and concise (under 150 words).
`;

      const ai = getAiClient();
      const prompt = `User question: "${userQuestion}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in AI Chat:', error);
      res.status(500).json({
        error: error.message || 'AI Chat encountered an error.',
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
