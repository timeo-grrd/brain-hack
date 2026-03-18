const SYSTEM_PROMPT = `Rôle : Tu es un expert en analyse forensique numérique et en détection d'images générées par l'Intelligence Artificielle.

Mission : Analyse l'image fournie avec une extrême attention aux détails pour déterminer si elle a été générée par une IA ou s'il s'agit d'une vraie photographie. Ne te fie pas à l'impression générale, mais cherche les "artefacts" spécifiques à l'IA.

Points de contrôle obligatoires :

Anatomie humaine : Observe les mains (nombre de doigts, jointures, fusion avec les objets), les dents, les oreilles et la symétrie des yeux.

Texte et typographie : Repère tous les textes, logos ou panneaux. Les lettres sont-elles lisibles, cohérentes, ou ressemblent-elles à des symboles extraterrestres ou à des mots mal orthographiés ?

Logique spatiale et arrière-plan : Les objets en arrière-plan ont-ils des formes définies ou se fondent-ils les uns dans les autres ? Les lignes droites (murs, étagères) sont-elles continues ? Y a-t-il des personnes en arrière-plan aux visages ou corps déformés ?

Physique et éclairage : Les ombres sont-elles cohérentes avec les sources de lumière ? Les reflets dans les vitres ou les liquides sont-ils logiques ? L'éclairage est-il trop "parfait" ou artificiel ?

Textures : La peau, les vêtements ou les objets ont-ils un aspect trop lisse, plastique ou un effet "peinture à l'huile" ?

Format de réponse attendu (obligatoire, sans markdown) :
1) Première ligne : "✅ Verdict : IA" ou "✅ Verdict : PAS IA"
2) Ligne suivante : "Argumentation :"
3) Ensuite 3 à 6 lignes commençant par "🎯"
4) Dernière ligne : "La règle d'or : ..."
N'utilise jamais les symboles markdown comme #, ##, ###, **.`;

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Impossible de lire l'image."));
    reader.readAsDataURL(file);
  });
}

function extractAssistantText(data) {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item?.type === "text") {
          return item.text || "";
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  return "Réponse vide de l'API.";
}

function normalizeVerdict(text) {
  const cleaned = String(text || "").trim();
  if (!cleaned) {
    return "✅ Verdict : IA\n🎯 Pas assez d'indices pour conclure proprement.\nLa règle d'or : Vérifie toujours la source et recoupe avec une autre preuve.";
  }

  const firstLine = cleaned.split("\n")[0].toLowerCase();
  const hasVerdict = /verdict\s*:\s*(ia|pas ia)/i.test(firstLine);

  if (hasVerdict) {
    return cleaned;
  }

  const hintsIA = /génér|genér|ia|artific|fake|synthétique|synthese|créée par ia/i.test(cleaned);
  const forcedVerdict = hintsIA ? "✅ Verdict : IA" : "✅ Verdict : PAS IA";
  return `${forcedVerdict}\n${cleaned}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanMarkdownLine(line) {
  return line
    .replace(/^\s{0,3}#{1,6}\s*/g, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s*/g, "")
    .trim();
}

function renderResponse(apiResponse, resultCard, text) {
  const finalText = normalizeVerdict(text);
  const lowerText = finalText.toLowerCase();

  apiResponse.classList.remove("verdict-ia", "verdict-not-ia");
  if (lowerText.includes("verdict : pas ia")) {
    apiResponse.classList.add("verdict-not-ia");
  } else {
    apiResponse.classList.add("verdict-ia");
  }

  const rawLines = finalText
    .split("\n")
    .map((line) => cleanMarkdownLine(line))
    .filter((line) => line.length > 0);

  const verdictLine = rawLines.find((line) => /verdict\s*:/i.test(line)) || "✅ Verdict : IA";
  const argumentLines = rawLines.filter(
    (line) =>
      line !== verdictLine &&
      !/^argumentation\s*:/i.test(line) &&
      !/^la règle d'or\s*:/i.test(line)
  );
  const ruleLine = rawLines.find((line) => /^la règle d'or\s*:/i.test(line));

  const argumentsHtml = argumentLines
    .map((line) => `<li>${escapeHtml(line.replace(/^🎯\s*/i, ""))}</li>`)
    .join("");

  apiResponse.innerHTML = `
    <div class="verdict-line">${escapeHtml(verdictLine)}</div>
    <div class="argument-title">Argumentation :</div>
    <ul class="argument-list">${argumentsHtml}</ul>
    ${ruleLine ? `<div class="rule-line">${escapeHtml(ruleLine)}</div>` : ""}
  `;
  resultCard.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const bouton = document.getElementById("btn-detective");
  const message = document.getElementById("message-scan");
  const apiResponse = document.getElementById("api-response");
  const imageUpload = document.getElementById("image-upload");
  const resultCard = document.getElementById("result-card");
  const configuredBaseUrl = String(window.APP_CONFIG?.API_BASE_URL || "").trim();
  const apiBaseUrl = configuredBaseUrl.replace(/\/$/, "");

  if (!bouton || !message || !apiResponse || !imageUpload || !resultCard) {
    return;
  }

  bouton.addEventListener("click", async function () {
    const selectedFile = imageUpload.files?.[0];

    if (!selectedFile) {
      message.style.display = "block";
      message.style.color = "#e84118";
      message.innerText = "❌ Ajoute d'abord une image à analyser.";
      return;
    }

    bouton.disabled = true;
    bouton.innerText = "🕵️‍♂️ Analyse en cours...";
    bouton.style.opacity = "0.7";
    message.style.display = "block";
    message.style.color = "#e84118";
    message.innerText = "⏳ Analyse des pixels en cours...";
    apiResponse.innerText = "";
    apiResponse.classList.remove("verdict-ia", "verdict-not-ia");
    resultCard.style.display = "none";

    try {
      const base64 = await convertFileToBase64(selectedFile);
      const imageDataUrl = `data:${selectedFile.type};base64,${base64}`;
      const endpoint = `${apiBaseUrl}/api/detect-image`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Erreur API inconnue");
      }

      const assistantText = String(data?.result || "").trim() || "Réponse vide de l'API.";
      renderResponse(apiResponse, resultCard, assistantText);
      message.style.color = "#4cd137";
      message.innerText = "✅ Analyse terminée.";
    } catch (error) {
      message.style.color = "#e84118";
      message.innerText = "❌ Erreur pendant l'analyse.";
      renderResponse(apiResponse, resultCard, `✅ Verdict : IA\n🎯 Analyse indisponible pour le moment.\nDétail: ${error.message}\nLa règle d'or : Vérifie toujours avec plusieurs sources.`);
    } finally {
      bouton.disabled = false;
      bouton.innerText = "🔍 Lancer le Scan IA";
      bouton.style.opacity = "1";
    }
  });
});