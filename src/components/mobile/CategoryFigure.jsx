// Kategoriya rasmlaridan faqat odam turgan qismini ko'rsatadi

// Har bir rasmdagi odam egallagan soha (rasm o'lchamiga nisbatan): [chap, tepa, o'ng, past].
// Rasmlar turli formatda (kvadrat va 16:9) — shu soha kartaga to'liq sig'diriladi.
const CROPS = {
  1: [0, 0.01, 1, 1],
  2: [0.474, 0.01, 1, 1],
  3: [0.495, 0.01, 0.985, 1],
  4: [0.496, 0.03, 0.984, 1],
  5: [0.47, 0, 1, 1],
  6: [0.446, 0.03, 0.984, 1],
  7: [0.465, 0.02, 0.978, 1],
  8: [0.45, 0.04, 0.978, 1],
  9: [0.504, 0.05, 0.988, 1],
  10: [0.415, 0.01, 0.976, 1],
  11: [0.483, 0.03, 1, 1],
  12: [0.503, 0.04, 0.971, 1],
}
const RATIOS = { 1: 1 }
const WIDE = 16 / 9

function figureStyle(image) {
  const n = Number(image.match(/hero-image(\d+)/)?.[1])
  const [x0, y0, x1, y1] = CROPS[n] ?? [0, 0, 1, 1]
  const ratio = RATIOS[n] ?? WIDE
  const w = x1 - x0
  const h = y1 - y0
  return {
    box: { aspectRatio: `${(w * ratio).toFixed(4)} / ${h.toFixed(4)}` },
    img: { width: `${100 / w}%`, left: `${(-x0 / w) * 100}%`, top: `${(-y0 / h) * 100}%` },
  }
}

export default function CategoryFigure({ image, className = '' }) {
  const style = figureStyle(image)
  return (
    <span className={`cat-figure ${className}`} style={style.box} aria-hidden="true">
      <img src={image} alt="" style={style.img} loading="lazy" decoding="async" />
    </span>
  )
}
