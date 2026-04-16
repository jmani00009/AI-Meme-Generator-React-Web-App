import { useMemo, useState } from "react";
import api from "./api";
import TemplateSelector from "./components/TemplateSelector";
import StylePicker from "./components/StylePicker";
import MemeCanvas from "./components/MemeCanvas";
import ModeSelector from "./components/ModeSelector";
import AiMemeCanvas from "./components/AiMemeCanvas";

const templates = [
  { id: "drake", name: "Drake", src: "/templates/drake.svg" },
  { id: "distracted", name: "Distracted", src: "/templates/distracted.svg" },
  { id: "woman-yelling", name: "Cat Table", src: "/templates/woman-yelling.svg" },
  { id: "success-kid", name: "Success Kid", src: "/templates/success-kid.svg" },
  { id: "two-buttons", name: "Two Buttons", src: "/templates/two-buttons.svg" },
];

const fallbackCaption = (topicValue, styleValue) => {
  const safeTopic = String(topicValue || "this moment").toUpperCase();
  const safeStyle = String(styleValue || "funny").toLowerCase();

  if (safeStyle.includes("dark")) {
    return {
      top: `ME THINKING ABOUT ${safeTopic}`.slice(0, 120),
      bottom: "AND THE VOID THINKS BACK".slice(0, 120),
    };
  }

  if (safeStyle.includes("relatable")) {
    return {
      top: `WHEN ${safeTopic} HAPPENS AGAIN`.slice(0, 120),
      bottom: "EVERYONE ACTS LIKE THIS IS FINE".slice(0, 120),
    };
  }

  return {
    top: `ME TRYING TO HANDLE ${safeTopic}`.slice(0, 120),
    bottom: "TASK FAILED SUCCESSFULLY".slice(0, 120),
  };
};

const fallbackImageUrl = (topicValue, styleValue) => {
  const prompt = `${styleValue} meme scene about ${topicValue}, expressive faces, internet meme style`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true`;
};

const App = () => {
  const [mode, setMode] = useState("template");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Funny");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [caption, setCaption] = useState({ top: "TOP TEXT", bottom: "BOTTOM TEXT" });
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId) || templates[0],
    [templateId]
  );

  const generateMeme = async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError("Please enter a topic before generating your meme.");
      return;
    }

    setLoading(true);
    setError("");
    setAiImageUrl("");

    let captionFailed = false;
    let imageFailed = false;

    try {
      const response = await api.post("/api/caption", {
        topic: cleanTopic,
        style,
        template: selectedTemplate.name,
      });

      setCaption({
        top: response.data?.top || "TOP TEXT",
        bottom: response.data?.bottom || "BOTTOM TEXT",
      });
    } catch (_requestError) {
      captionFailed = true;
      setCaption(fallbackCaption(cleanTopic, style));
    }

    if (mode === "ai") {
      setGeneratingImage(true);
      try {
        const imageResponse = await api.post("/api/generate-image", {
          topic: cleanTopic,
          style,
        });
        setAiImageUrl(imageResponse.data?.imageUrl || fallbackImageUrl(cleanTopic, style));
      } catch (_imageError) {
        imageFailed = true;
        setAiImageUrl(fallbackImageUrl(cleanTopic, style));
      } finally {
        setGeneratingImage(false);
      }
    }

    if (captionFailed && imageFailed) {
      setError("AI services were busy, so fallback meme text and image were used.");
    } else if (captionFailed) {
      setError("AI caption was busy, so fallback text was used.");
    } else if (imageFailed) {
      setError("AI image service was busy, so a fallback image was used.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl bg-white/85 p-5 shadow-xl ring-1 ring-orange-100 sm:p-8">
          <h1 className="font-display text-4xl uppercase tracking-widest text-slate-900 sm:text-5xl">
            AI Meme Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
            Pick a mode, choose a vibe, enter a topic, and generate a meme with AI.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Try: monday meetings, gym motivation, coding bugs"
              className="w-full rounded-xl border border-orange-200 bg-amber-50 px-4 py-3 text-sm text-slate-800 outline-none ring-brand-500 transition placeholder:text-slate-400 focus:ring-2 sm:text-base"
            />
            <button
              type="button"
              onClick={generateMeme}
              disabled={loading}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-rose-100 px-4 py-2 text-sm text-rose-700">{error}</div>
          )}
        </header>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <ModeSelector mode={mode} onSelect={setMode} />
            {mode === "template" && (
              <TemplateSelector
                selectedTemplate={templateId}
                onSelect={setTemplateId}
              />
            )}
            <StylePicker selectedStyle={style} onPick={setStyle} />
          </div>

          {mode === "template" ? (
            <MemeCanvas
              template={selectedTemplate}
              topText={caption.top}
              bottomText={caption.bottom}
            />
          ) : (
            <AiMemeCanvas
              imageUrl={aiImageUrl}
              topText={caption.top}
              bottomText={caption.bottom}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
