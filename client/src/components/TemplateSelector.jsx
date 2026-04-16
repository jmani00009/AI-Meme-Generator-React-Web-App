const templates = [
  { id: "drake", name: "Drake", src: "/templates/drake.svg" },
  { id: "distracted", name: "Distracted", src: "/templates/distracted.svg" },
  { id: "woman-yelling", name: "Cat Table", src: "/templates/woman-yelling.svg" },
  { id: "success-kid", name: "Success Kid", src: "/templates/success-kid.svg" },
  { id: "two-buttons", name: "Two Buttons", src: "/templates/two-buttons.svg" },
];

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {templates.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-105
            ${selectedTemplate === t.id
              ? "border-blue-500 ring-2 ring-blue-300 scale-105"
              : "border-gray-200 hover:border-blue-300"
            }`}
        >
          {/* Image — full cover */}
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <img
              src={t.src}
              alt={t.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Selected badge */}
            {selectedTemplate === t.id && (
              <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                ✓
              </div>
            )}
          </div>
          <p className="text-center text-xs py-1.5 text-gray-600 font-medium bg-white">
            {t.name}
          </p>
        </div>
      ))}
    </div>
  );
}
