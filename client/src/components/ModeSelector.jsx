const ModeSelector = ({ mode, onSelect }) => {
  return (
    <section className="rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-orange-100 sm:p-5">
      <h2 className="font-display text-2xl tracking-wide text-slate-900">Pick A Mode</h2>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("template")}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition sm:text-base ${
            mode === "template"
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-500"
          }`}
        >
          Template Meme
        </button>
        <button
          type="button"
          onClick={() => onSelect("ai")}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition sm:text-base ${
            mode === "ai"
              ? "border-teal-600 bg-teal-50 text-teal-700"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-500"
          }`}
        >
          AI Image Meme
        </button>
      </div>
    </section>
  );
};

export default ModeSelector;
