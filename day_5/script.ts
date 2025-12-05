import { initiateMetadata } from "../script.js";
import { DIGITS } from "./digits.js";

const preperationText = [
  "Santa is preparing…",
  "Reindeer are buckling up…",
  "Sleigh engines humming…",
  "Elves tightening the last bolts…",
  "Gift bags secured…",
  "Candy canes calibrated…",
  "North Star alignment complete…",
  "Magic dust levels optimal…",
  "Reindeer paws ready…",
  "Santa taking flight position…",
];

window.onload = () => {
  initiateMetadata();

  const countdownMeter = 10;

  const button = document.getElementById("control-button") as HTMLButtonElement;
  const countdownDiv = document.getElementById("countdown-display") as HTMLDivElement;
  const countdownText = document.getElementById("countdown-text") as HTMLParagraphElement;

  button.addEventListener("click", async () => {
    // prop setup for start
    countdownText.innerHTML = "";
    button.disabled = true;
    button.classList.remove("bg-emerald-600", "hover:bg-emerald-500");
    button.classList.add("bg-gray-600");
    const dubArray = [...preperationText];
    setCountdownPhrase(dubArray.splice(Math.floor(Math.random() * dubArray.length), 1)[0]);

    for (let i = countdownMeter; i >= 0; i--) {
      if (i && i % 4 === 0 && dubArray.length) {
        // draw on every 4 seconds
        setCountdownPhrase(dubArray.splice(Math.floor(Math.random() * dubArray.length), 1)[0]);
      }
      const parseString = String(i);
      countdownDiv.innerHTML = parseString
        .split("")
        .map((digit) => drawDigit(Number(digit)))
        .join("");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (i === 0) {
        // at the end reset
        button.disabled = false;
        button.classList.remove("bg-gray-600");
        button.classList.add("bg-emerald-600", "hover:bg-emerald-500");
        countdownText.innerHTML = `
        <span class="countdown-phrase launch-effect">
          🎅✨ SANTA’S SLEIGH IS LAUNCHING! ✨🎅
        </span>
      `;
        triggerSleighFly();
      }
    }
  });

  function triggerSleighFly() {
    // remove if exists
    const existing = document.getElementById("santa-sleigh");
    if (existing) existing.remove();

    // crete sleigh of screen
    const img = document.createElement("img");
    img.id = "santa-sleigh";
    img.src = "../img/sleigh.png";
    img.alt = "Santa's sleigh flying across the sky";
    document.body.appendChild(img);

    img.addEventListener(
      "animationend",
      () => {
        img.remove();
      },
      { once: true }
    );
  }

  function drawDigit(digit: number) {
    const lines = DIGITS[String(digit)]
      .map((line: string) => `<div class="line flex justify-center">${drawLine(line)}</div>`) // draw line
      .join(""); // join lines for one digit
    return `<div class="digit">${lines}</div>`; // wrap whole digit
  }

  function drawLine(line: string) {
    const boxes = line.split("");
    return boxes.map((char) => `<div class="box min-w-[12px] text-center">${char}</div>`).join(""); // seperate characters to boxes
  }

  function setCountdownPhrase(newText: string) {
    const existing = countdownText.querySelector(".countdown-phrase") as HTMLSpanElement | null;

    // first time
    if (!existing) {
      countdownText.innerHTML = `<span class="countdown-phrase slide-in">${newText}</span>`;
      return;
    }

    // remove any previous animation classes
    // and force a fresh slide-out animation
    existing.className = "countdown-phrase slide-out";

    existing.addEventListener(
      "animationend",
      () => {
        // after old text slides out replace with new one sliding in from left
        countdownText.innerHTML = `<span class="countdown-phrase slide-in">${newText}</span>`;
      },
      { once: true }
    );
  }
};
