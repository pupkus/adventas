import { initiateMetadata } from "../script.js";

type Sorted = {
  [key: string]: number[];
};

type Group = {
  key: string;
  words: string[];
};

let anagrams: string[] = [];
let sortedWords: Sorted = {};
let resultArray: string[][] = [];

window.onload = () => {
  initiateMetadata();

  const form = document.querySelector("form") as HTMLFormElement;
  const sortButton = document.getElementById("sort-button") as HTMLButtonElement;
  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  const anagramInput = document.getElementById("anagram-input") as HTMLInputElement;
  const inputContainer = document.getElementById("input-container") as HTMLDivElement;
  const resultContainer = document.getElementById("results") as HTMLDivElement;
  const groupCountBadge = document.getElementById("group-count-badge") as HTMLSpanElement;

  let currentGroups: Group[] = [];
  let sortTimeoutId: number | undefined;

  function updateGroupBadge() {
    if (!resultArray.length) {
      groupCountBadge.classList.add("hidden");
      groupCountBadge.textContent = "";
      return;
    }
    const groupCount = resultArray.length;
    groupCountBadge.textContent = `${groupCount} group${groupCount === 1 ? "" : "s"}`;
    groupCountBadge.classList.remove("hidden");
  }

  function addWordChip(word: string) {
    const newChip = document.createElement("span");
    newChip.className =
      "price inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-teal-900 text-teal-100 border border-teal-600/70 shadow-sm";
    newChip.innerText = word;
    inputContainer.appendChild(newChip);
  }

  function createWordPill(word: string): HTMLSpanElement {
    const wordSpan = document.createElement("span");
    wordSpan.className =
      "price inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-900 text-blue-100 border border-blue-600/70";
    wordSpan.innerText = word;
    return wordSpan;
  }

  function createGroupCard(group: Group, groupIndex: number): HTMLDivElement {
    const card = document.createElement("div");
    card.dataset.groupKey = group.key;
    card.className =
      "group-card bg-slate-800/60 border border-slate-700 rounded-lg w-full text-left shadow-md px-4 py-3 transition transform hover:-translate-y-0.5 hover:shadow-lg";

    const header = document.createElement("div");
    header.className = "flex items-center justify-between mb-2";

    const title = document.createElement("span");
    title.className = "text-xs font-semibold uppercase tracking-wide text-slate-300";
    title.textContent = `Group ${groupIndex + 1}`;

    const sizeBadge = document.createElement("span");
    sizeBadge.className =
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-900/70 text-emerald-100 border border-emerald-600/80";
    sizeBadge.textContent = `${group.words.length} word${group.words.length === 1 ? "" : "s"}`;

    header.appendChild(title);
    header.appendChild(sizeBadge);
    card.appendChild(header);

    const wordsWrap = document.createElement("div");
    wordsWrap.className = "flex flex-wrap gap-1 group-words";

    group.words.forEach((word) => {
      wordsWrap.appendChild(createWordPill(word));
    });

    card.appendChild(wordsWrap);
    return card;
  }

  function renderGroups(groups: Group[]) {
    resultContainer.innerHTML = "";

    // rerender cards with initial hidden
    groups.forEach((group, groupIndex) => {
      const card = createGroupCard(group, groupIndex);

      // slightly moved and transparent
      card.style.opacity = "0";
      card.style.transform = "translateY(10px) scale(0.97)";
      card.style.transition = "none";

      resultContainer.appendChild(card);
    });

    // shuffle in with staggered animation
    const cards = Array.from(resultContainer.children) as HTMLDivElement[];

    cards.forEach((card, index) => {
      const delay = 40 * index + Math.random() * 60; // fast but readable

      setTimeout(() => {
        card.style.transition = "opacity 180ms ease-out, transform 180ms ease-out";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
      }, delay);
    });
  }

  function animateGroupsToSorted(initialGroups: Group[]) {
    // measure current positions
    const firstRects = new Map<string, DOMRect>();
    const oldCards = Array.from(resultContainer.children) as HTMLDivElement[];

    oldCards.forEach((card) => {
      const key = card.dataset.groupKey;
      if (!key) return;
      firstRects.set(key, card.getBoundingClientRect());
    });

    // sort groups by size
    const sizeSortedGroups = [...initialGroups].sort((a, b) => b.words.length - a.words.length);

    // size sorted result array
    resultArray = sizeSortedGroups.map((g) => g.words);
    updateGroupBadge();

    // rerender in new group order, highlight groups being sorted
    resultContainer.innerHTML = "";
    sizeSortedGroups.forEach((group, groupIndex) => {
      const card = createGroupCard(group, groupIndex);
      card.classList.add("moving");
      resultContainer.appendChild(card);
    });

    // animate from old positions to new
    const newCards = Array.from(resultContainer.children) as HTMLDivElement[];

    newCards.forEach((card) => {
      const key = card.dataset.groupKey;
      if (!key) return;

      const firstRect = firstRects.get(key);
      if (!firstRect) return;

      const lastRect = card.getBoundingClientRect();
      const dx = firstRect.left - lastRect.left;
      const dy = firstRect.top - lastRect.top;

      card.style.transform = `translate(${dx}px, ${dy}px)`;
      card.style.transition = "none";

      requestAnimationFrame(() => {
        card.style.transition = "transform 300ms ease";
        card.style.transform = "translate(0, 0)";
      });
    });

    // after sorting gorups, sort words inside each group
    setTimeout(() => {
      const finalGroups = sizeSortedGroups.map((g) => ({
        key: g.key,
        words: [...g.words].sort(),
      }));

      resultArray = finalGroups.map((g) => g.words);
      updateGroupBadge();

      const cardsNow = Array.from(resultContainer.children) as HTMLDivElement[];

      cardsNow.forEach((card) => {
        const key = card.dataset.groupKey;
        if (!key) return;
        const group = finalGroups.find((g) => g.key === key);
        if (!group) return;

        const wordsWrap = card.querySelector(".group-words") as HTMLDivElement;
        if (!wordsWrap) return;

        wordsWrap.innerHTML = "";
        group.words.forEach((word) => {
          wordsWrap.appendChild(createWordPill(word));
        });

        // remove highlight after everything is done
        card.classList.remove("moving");
      });
    }, 350);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = anagramInput.value.trim();

    if (input) {
      // split and remove whitespace
      const split = input
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      split.forEach((word) => {
        const cleaned = word.toLowerCase();
        anagrams.push(cleaned);
        addWordChip(cleaned);
      });

      anagramInput.value = "";
    }
  });

  resetButton.addEventListener("click", () => {
    anagrams = [];
    sortedWords = {};
    resultArray = [];
    currentGroups = [];
    inputContainer.innerHTML = "";
    resultContainer.innerHTML = "";
    updateGroupBadge();
  });

  sortButton.addEventListener("click", () => {
    if (anagrams.length === 0) return;

    // build sortedWords map
    sortedWords = anagrams.reduce((acc: Sorted, word: string, index: number) => {
      const current = word.split("").sort().join("");
      if (acc[current]) {
        acc[current].push(index);
      } else {
        acc[current] = [index];
      }
      return acc;
    }, {});

    const keys = Object.keys(sortedWords);

    // initial groups without sorting
    currentGroups = keys.map((key) => ({
      key,
      words: sortedWords[key].map((index) => anagrams[index]),
    }));

    // display unsorted groups
    resultArray = currentGroups.map((g) => g.words);
    renderGroups(currentGroups);
    updateGroupBadge();

    // wait untill animation begins
    sortTimeoutId = window.setTimeout(() => {
      if (!currentGroups.length) return;
      animateGroupsToSorted(currentGroups);
    }, 1000);
  });
};
