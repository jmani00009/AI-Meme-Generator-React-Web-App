const styles = ["Funny", "Dark", "Relatable"];

const StylePicker = ({ selectedStyle, onPick }) => {
  return (
    <section className="rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-orange-100 sm:p-5">
      <h2 className="font-display text-2xl tracking-wide text-slate-900">Choose A Vibe</h2>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {styles.map((style) => {
          const isActive = selectedStyle === style;

          return (
            <button
              key={style}
              type="button"
              onClick={() => onPick(style)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition sm:text-base ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-amber-100 text-slate-700 hover:bg-amber-200"
              }`}
            >
              {style}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default StylePicker;
