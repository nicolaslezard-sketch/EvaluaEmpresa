export function RadarPreview() {
  // Radar simple SVG (ejemplo). No depende de librerías y es "premium" sin recargar.
  // Escala: 5 ejes. Valores demo.
  const values = [3.0, 4.0, 3.5, 2.5, 4.0];
  const max = 5;
  const cx = 140;
  const cy = 120;
  const radius = 86;

  const toPoint = (i: number, v: number) => {
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
    const r = (v / max) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  };

  const polygon = values
    .map((v, i) => {
      const p = toPoint(i, v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  const ring = (k: number) => {
    const r = (k / max) * radius;
    const pts = new Array(5).fill(0).map((_, i) => {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(
        cy +
        Math.sin(angle) * r
      ).toFixed(1)}`;
    });
    return pts.join(" ");
  };

  return (
    <div className="w-full">
      <svg viewBox="0 0 280 240" className="w-full">
        {/* grid */}
        <polygon
          points={ring(1)}
          fill="none"
          stroke="rgb(228 228 231)"
          strokeWidth="1"
        />
        <polygon
          points={ring(2)}
          fill="none"
          stroke="rgb(228 228 231)"
          strokeWidth="1"
        />
        <polygon
          points={ring(3)}
          fill="none"
          stroke="rgb(228 228 231)"
          strokeWidth="1"
        />
        <polygon
          points={ring(4)}
          fill="none"
          stroke="rgb(228 228 231)"
          strokeWidth="1"
        />
        <polygon
          points={ring(5)}
          fill="none"
          stroke="rgb(212 212 216)"
          strokeWidth="1"
        />

        {/* axes */}
        {new Array(5).fill(0).map((_, i) => {
          const p = toPoint(i, max);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgb(228 228 231)"
              strokeWidth="1"
            />
          );
        })}

        {/* data */}
        <polygon
          points={polygon}
          fill="rgb(24 24 27 / 0.12)"
          stroke="rgb(24 24 27)"
          strokeWidth="1.5"
        />
        {values.map((v, i) => {
          const p = toPoint(i, v);
          return (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="rgb(24 24 27)" />
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-600">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <span>Financiero</span>
          <span className="font-medium text-zinc-900">3.0</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <span>Comercial</span>
          <span className="font-medium text-zinc-900">4.0</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <span>Operativo</span>
          <span className="font-medium text-zinc-900">3.5</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <span>Legal</span>
          <span className="font-medium text-zinc-900">2.5</span>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <span>Estratégico</span>
          <span className="font-medium text-zinc-900">4.0</span>
        </div>
      </div>
    </div>
  );
}
