import { initiateMetadata } from "../script.js";

window.onload = () => {
  initiateMetadata();

  const form = document.querySelector("form") as HTMLFormElement;
  const filterButton = document.getElementById("filter-button") as HTMLButtonElement;
  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  const studentInput = document.getElementById("student-input") as HTMLInputElement;
  const inputContainer = document.getElementById("input-container") as HTMLDivElement;
  const resultContainer = document.getElementById("results") as HTMLDivElement;

  let allStudents: string[] = [];

  const girlsLastChar = ["a", "ė"];

  function addNameChip(word: string) {
    const newChip = document.createElement("span");
    newChip.className =
      "price inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-teal-900 text-teal-100 border border-teal-600/70 shadow-sm";
    newChip.innerText = word;
    inputContainer.appendChild(newChip);
  }

  function createNameCard(student: string): HTMLDivElement {
    const card = document.createElement("div");
    card.dataset.studentName = student;
    card.className =
      "student-card bg-slate-800/60 border border-slate-700 rounded-lg w-full text-left shadow-md px-4 py-3";

    const title = document.createElement("span");
    title.className = "text-xs font-semibold uppercase tracking-wide text-slate-300";
    title.textContent = student;

    card.appendChild(title);
    return card;
  }

  function renderStudents(students: string[]) {
    resultContainer.innerHTML = `
        <p class="pt-2 text-base font-semibold">
      Total girls: <span class="text-emerald-400">${allStudents.filter((s) => isGirl(s)).length}</span>
    </p>`;
    students.forEach((student, index) => {
      const card = createNameCard(student);

      // start hidden via class
      card.classList.add("enter", "spaced");
      resultContainer.appendChild(card);

      const delay = 40 * index + Math.random() * 60;

      setTimeout(() => {
        // force the initial state
        requestAnimationFrame(() => {
          card.classList.add("entered");
          card.classList.remove("enter");
        });
      }, delay);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = studentInput.value.trim();

    if (input) {
      // split by ',' and remove whitespace
      const split = input
        .split(",")
        .map((student) => student.trim())
        .filter((student) => student.length > 0);

      split.forEach((student) => {
        const cleaned = student;
        allStudents.push(cleaned);
        addNameChip(cleaned);
      });

      studentInput.value = "";
    }
  });

  resetButton.addEventListener("click", () => {
    allStudents = [];
    inputContainer.innerHTML = "";
    resultContainer.innerHTML = "";
  });

  filterButton.addEventListener("click", () => {
    if (allStudents.length === 0) return;

    renderStudents(allStudents);

    const cards = Array.from(resultContainer.querySelectorAll<HTMLDivElement>(".student-card"));

    // mark purging after the entrance has begun
    setTimeout(() => {
      cards.forEach((card) => {
        const name = card.dataset.studentName ?? "";
        if (!isGirl(name)) card.classList.add("purging", "glow");
      });
    }, 800);

    // collapse them
    setTimeout(() => {
      cards.forEach((card) => {
        const name = card.dataset.studentName ?? "";
        if (!isGirl(name)) collapseCard(card);
      });
    }, 1500);

    // delete elements
    setTimeout(() => {
      cards.forEach((card) => {
        const name = card.dataset.studentName ?? "";
        if (!isGirl(name)) card.remove();
      });
    }, 2000);
  });

  function collapseCard(card: HTMLDivElement) {
    // lock current height (px)
    const h = card.getBoundingClientRect().height;
    card.style.height = `${h}px`;

    // also lock padding
    const cs = getComputedStyle(card);
    card.style.paddingTop = cs.paddingTop;
    card.style.paddingBottom = cs.paddingBottom;

    // apply collapse
    card.classList.add("collapse");
    card.classList.remove("spaced");

    // animate height to 0
    requestAnimationFrame(() => {
      card.style.height = "0px";
      card.style.paddingTop = "0px";
      card.style.paddingBottom = "0px";
    });
  }

  function isGirl(student: string) {
    const parts = student.trim().split(/\s+/);
    const firstName = parts[parts.length - 1] ?? "";
    const lastChar = firstName.at(-1)?.toLowerCase() ?? "";
    return girlsLastChar.includes(lastChar);
  }
};
