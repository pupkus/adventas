import { initiateMetadata } from "../script.js";

type Melon = {
  id: number;
  label: string;
  weight: number | null;
};

let melons: Melon[] = [];
let currentIndex = 0;

window.onload = () => {
  initiateMetadata();

  const melonCountInput = document.getElementById(
    "melons-count"
  ) as HTMLInputElement;
  const weightInput = document.getElementById("weight") as HTMLInputElement;

  const countBlock = document.getElementById("count-input") as HTMLDivElement;
  const weightBlock = document.getElementById("weight-input") as HTMLDivElement;

  const submit = document.getElementById("submit") as HTMLButtonElement;
  const cancel = document.getElementById("cancel") as HTMLButtonElement;
  const inputContainer = document.getElementById(
    "input-container"
  ) as HTMLDivElement;
  const resultDiv = document.getElementById("results") as HTMLDivElement;

  enum Mode {
    Count = "count",
    Weights = "weights",
    Done = "done",
  }

  let mode: Mode = Mode.Count;

  function resetAll() {
    melons = [];
    currentIndex = 0;
    mode = Mode.Count;

    melonCountInput.value = "";
    weightInput.value = "";
    inputContainer.innerHTML = "";
    resultDiv.innerHTML = "";

    countBlock.classList.remove("hidden");
    weightBlock.classList.add("hidden");

    cancel.classList.add("hidden");
    submit.querySelector("span")!.textContent = "Next";

    setTimeout(() => melonCountInput.focus(), 0);
  }

  resetAll();

  function createMelons(count: number) {
    melons = Array.from({ length: count }, (_, i) => ({
      id: i,
      label: `Melon ${i + 1}`,
      weight: null,
    }));
  }

  /**
   * 1. measure current positions
   * 2. rerender in new order
   * 3. measure new positions and animate transform from old to new
   */
  function renderMelons({
    animate,
    highlightId,
    noFlip = false,
  }: {
    animate: boolean;
    highlightId?: number;
    noFlip?: boolean;
  }) {
    const firstRects = new Map<number, DOMRect>();

    // 1. measure
    if (animate && !noFlip) {
      Array.from(inputContainer.children).forEach((el) => {
        const card = el as HTMLDivElement;
        const id = Number(card.dataset.melonId);
        if (!Number.isNaN(id)) {
          firstRects.set(id, card.getBoundingClientRect());
        }
      });
    }

    // 2. rerender in sorted order
    inputContainer.innerHTML = "";

    const sorted = [...melons].sort((a, b) => {
      if (a.weight === null && b.weight === null) return a.id - b.id;
      if (a.weight === null) return 1;
      if (b.weight === null) return -1;
      return a.weight - b.weight;
    });

    for (const melon of sorted) {
      const card = document.createElement("div");
      card.dataset.melonId = String(melon.id);
      card.className =
        "melon-card bg-slate-800/60 border border-slate-700 rounded-lg w-full text-center shadow-md flex items-center justify-between px-4 py-3";

      // highlight the updated / closest melon
      if (highlightId === melon.id) {
        card.classList.add("moving");
      }

      card.innerHTML = `
        <p class="font-semibold text-sm sm:text-base flex-1 text-left">${
          melon.label
        }</p>
        <p class="text-sm sm:text-base flex-1 text-right">
          Weight: <span class="font-semibold">
            ${melon.weight !== null ? melon.weight.toFixed(2) + " kg" : "-"}
          </span>
        </p>
      `;
      inputContainer.appendChild(card);
    }

    // 3. animate from old positions to new positions (in noFlip mode)
    if (animate && !noFlip && firstRects.size > 0) {
      const newCards = Array.from(inputContainer.children) as HTMLDivElement[];

      newCards.forEach((card) => {
        const id = Number(card.dataset.melonId);
        const firstRect = firstRects.get(id);
        if (!firstRect) return;

        const lastRect = card.getBoundingClientRect();
        const dx = firstRect.left - lastRect.left;
        const dy = firstRect.top - lastRect.top;

        const scale = id === highlightId ? 1.02 : 1;

        // start from old position (and slightly scaled if it's the highlighted one)
        card.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        card.style.transition = "none";

        requestAnimationFrame(() => {
          card.style.transition = "transform 250ms ease";
          card.style.transform = "translate(0, 0) scale(1)";

          // remove glow from the updated melon card after the movement
          if (id === highlightId) {
            const handleEnd = () => {
              card.classList.remove("moving");
              card.removeEventListener("transitionend", handleEnd);
            };
            card.addEventListener("transitionend", handleEnd);
          }
        });
      });
    }
  }

  function handleCountPhase() {
    const count = parseInt(melonCountInput.value, 10);

    if (!Number.isFinite(count) || count <= 0) {
      melonCountInput.focus();
      melonCountInput.select();
      return;
    }

    createMelons(count);
    currentIndex = 0;
    mode = Mode.Weights;

    renderMelons({ animate: false });

    countBlock.classList.add("hidden");
    weightBlock.classList.remove("hidden");

    cancel.classList.remove("hidden");
    submit.querySelector("span")!.textContent = "Add weight";

    setTimeout(() => weightInput.focus(), 0);
  }

  function handleWeightPhase() {
    const value = weightInput.value.trim();
    const numeric = parseFloat(value);

    if (!value || !Number.isFinite(numeric) || numeric < 0) {
      weightInput.focus();
      return;
    }

    if (currentIndex >= melons.length) {
      return;
    }

    const updatedMelonId = melons[currentIndex].id;

    melons[currentIndex].weight = numeric;
    currentIndex += 1;
    weightInput.value = "";

    // live sort + smooth swap + transient highlight for the updated melon
    renderMelons({ animate: true, highlightId: updatedMelonId });

    if (currentIndex >= melons.length) {
      handleResults();
    } else {
      setTimeout(() => weightInput.focus(), 0);
    }
  }

  function handleResults() {
    mode = Mode.Done;
    weightBlock.classList.add("hidden");

    const weights = melons
      .map((m) => m.weight)
      .filter((w): w is number => w !== null);

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const average = weights.length ? totalWeight / weights.length : 0;

    let closestIndex = -1;
    let closestDiff = Infinity;

    melons.forEach((melon, idx) => {
      if (melon.weight === null) return;
      const diff = Math.abs(melon.weight - average);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = idx;
      }
    });

    const closestMelon = closestIndex >= 0 ? melons[closestIndex] : null;

    resultDiv.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Results</h2>
      <p class="text-lg">
        Total weight of melons:
        <span class="font-semibold">${totalWeight.toFixed(2)} kg</span>
      </p>
      <p class="text-lg">
        Average weight per melon:
        <span class="font-semibold">${average.toFixed(2)} kg</span>
      </p>
      ${
        closestMelon && closestMelon.weight !== null
          ? `<p class="text-lg">
              Melon closest to average:
              <span class="font-semibold">
                ${closestMelon.label} (${closestMelon.weight.toFixed(2)} kg)
              </span>
            </p>`
          : ""
      }
    `;

    submit.querySelector("span")!.textContent = "Start over";

    // highlight closest to average melon card and keep glow
    if (closestMelon) {
      renderMelons({
        animate: false,
        highlightId: closestMelon.id,
        noFlip: true, // no position animation, just glow
      });
    }
  }

  submit.addEventListener("click", () => {
    if (mode === Mode.Count) {
      handleCountPhase();
    } else if (mode === Mode.Weights) {
      handleWeightPhase();
    } else {
      // Done -> reset
      resetAll();
    }
  });

  cancel.addEventListener("click", () => {
    resetAll();
  });

  weightInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (mode === Mode.Weights) {
        handleWeightPhase();
      }
    }
  });

  melonCountInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (mode === Mode.Count) {
        handleCountPhase();
      }
    }
  });
};
