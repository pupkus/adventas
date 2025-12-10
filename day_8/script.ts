import { initiateMetadata } from "../script.js";

window.onload = () => {
  initiateMetadata();

  const gridDisplay = document.getElementById("grid-display") as HTMLElement;
  const form = document.querySelector("form") as HTMLFormElement;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const N = Number(new FormData(form).get("length")) || 0;
    const R = N + 2; // border added on all sides

    gridDisplay.innerHTML = "";
    gridDisplay.style.display = "grid";
    gridDisplay.style.gridTemplateColumns = `repeat(${R}, minmax(0, 50px))`;
    gridDisplay.style.gap = "0";

    for (let i = 0; i < R * R; i++) {
      gridDisplay.appendChild(getCell(i, N, R));
    }
  });
};

function getCell(i: number, N: number, R: number): HTMLDivElement {
  const cell = document.createElement("div");

  const row = Math.floor(i / R); // full-grid row
  const col = i % R; // full-grid col

  const delay = Math.min((row + col) * 25, 600); // cap delay so big grids
  const isBorder = row === 0 || row === R - 1 || col === 0 || col === R - 1;

  if (isBorder) return make(cell, "#", "bg-red-400 text-slate-900", delay);

  const r = row;
  const c = col;

  // sum = row + col (1-indexed inner grid)
  const sum = r + c;

  // apply rules
  if (sum % 15 === 0) return make(cell, "G", "bg-sky-300 text-slate-900", delay);
  if (sum % 3 === 0) return make(cell, "T", "bg-amber-300 text-slate-900", delay);
  if (sum % 5 === 0) return make(cell, "S", "bg-emerald-400 text-slate-900", delay);

  return make(cell, ".", "bg-slate-200 text-slate-900", delay);
}

function make(el: HTMLDivElement, char: string, color: string, delay: number) {
  el.className = [
    "grid-cell",
    color,
    "border",
    "border-slate-700",
    "aspect-square",
    "transition-transform",
    "hover:scale-110",
    "animate-pop",
  ].join(" ");

  el.style.animationDelay = `${delay}ms`;
  el.innerText = char;
  return el;
}
