import { useRef, useEffect, useState } from "react";

export default function AiMemeCanvas({ imageUrl, topText, bottomText }) {
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!imageUrl || !topText) return;
    setImgLoaded(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const W = 600, H = 600;
      canvas.width = W;
      canvas.height = H;

      const scale = Math.max(W / img.width, H / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const sx = (W - sw) / 2;
      const sy = (H - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh);

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, W, H);

      const drawText = (text, y, isBottom = false) => {
        const fontSize = W * 0.075;
        ctx.font = `900 ${fontSize}px Impact, Arial Black`;
        ctx.textAlign = "center";
        ctx.lineWidth = fontSize * 0.12;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";

        const words = text.toUpperCase().split(" ");
        let lines = [];
        let current = "";
        const maxW = W * 0.85;

        words.forEach(word => {
          const test = current ? `${current} ${word}` : word;
          if (ctx.measureText(test).width > maxW && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        });
        if (current) lines.push(current);

        const lineH = fontSize * 1.2;
        const totalH = lines.length * lineH;

        lines.forEach((line, i) => {
          let yPos;
          if (isBottom) {
            yPos = y - totalH + (i + 1) * lineH;
          } else {
            yPos = y + i * lineH;
          }
          ctx.strokeText(line, W / 2, yPos);
          ctx.fillText(line, W / 2, yPos);
        });
      };

      drawText(topText, 55);
      drawText(bottomText, H - 20, true);
      setImgLoaded(true);
    };
  }, [imageUrl, topText, bottomText]);

  const downloadMeme = () => {
    const link = document.createElement("a");
    link.download = "ai-meme.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const copyText = () => {
    navigator.clipboard.writeText(`${topText}\n${bottomText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Loading */}
      {imageUrl && !imgLoaded && (
        <div className="flex flex-col items-center gap-3 py-12 w-full bg-purple-50 rounded-2xl">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"/>
          <p className="text-purple-500 text-sm font-medium">AI image ban rahi hai... 🎨</p>
          <p className="text-purple-400 text-xs">10-15 seconds lagenge</p>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full rounded-2xl shadow-xl border border-gray-200"
        style={{ display: imgLoaded ? "block" : "none" }}
      />

      {/* Caption Text Box */}
      {topText && (
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Generated Caption
            </p>
            <button
              onClick={copyText}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-all"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-xl px-4 py-2">
              <p className="text-xs text-blue-400 mb-1">Top text</p>
              <p className="text-sm font-medium text-gray-800">{topText}</p>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-2">
              <p className="text-xs text-purple-400 mb-1">Bottom text</p>
              <p className="text-sm font-medium text-gray-800">{bottomText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      {imgLoaded && (
        <div className="flex gap-3 flex-wrap justify-center w-full">
          <button
            onClick={downloadMeme}
            className="flex-1 sm:flex-none px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
          >
            ⬇️ Download
          </button>
          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(topText + " " + bottomText)}`)}
            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-400 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition-all"
          >
            📱 WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
