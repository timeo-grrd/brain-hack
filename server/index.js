const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const SYSTEM_PROMPT = `Role: Tu es un expert en analyse forensique numerique et en detection d'images generees par IA.

Mission: Analyse l'image fournie avec attention pour determiner si elle est generee par IA ou si c'est une vraie photographie.

Format de reponse obligatoire, sans markdown:
1) Premiere ligne: "✅ Verdict : IA" ou "✅ Verdict : PAS IA"
2) Ligne suivante: "Argumentation :"
3) Ensuite 3 a 6 lignes commencant par "🎯"
4) Derniere ligne: "La regle d'or : ..."`;

app.use(express.json({ limit: "12mb" }));

// Serve static frontend from BrainHack folder.
app.use(express.static(path.join(__dirname, "..", "BrainHack")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "brainhack-api", timestamp: Date.now() });
});

app.post("/api/detect-image", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: {
          message: "OPENAI_API_KEY manquante sur le serveur.",
        },
      });
    }

    const imageDataUrl = String(req.body?.imageDataUrl || "").trim();
    if (!imageDataUrl.startsWith("data:image/")) {
      return res.status(400).json({
        error: {
          message: "Image invalide. Envoie une image au format data URL.",
        },
      });
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyse cette image pour un public collegien/lyceen et donne un verdict explicite : IA ou PAS IA.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({
        error: {
          message: data?.error?.message || "Erreur OpenAI.",
        },
      });
    }

    const content = data?.choices?.[0]?.message?.content;
    const result = Array.isArray(content)
      ? content
          .map((part) => {
            if (typeof part === "string") {
              return part;
            }
            if (part?.type === "text") {
              return part.text || "";
            }
            return "";
          })
          .join("\n")
          .trim()
      : String(content || "").trim();

    return res.json({ result: result || "Réponse vide de l'API." });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error?.message || "Erreur serveur inattendue.",
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`BrainHack server running on http://localhost:${PORT}`);
});
