import { initiateMetadata } from "../script.js";

window.onload = () => {
  initiateMetadata();

  const form = document.getElementById("form") as HTMLFormElement;
  const calculationMinuteArrow = document.querySelector(
    ".minute"
  ) as HTMLDivElement;
  const calculationHourArrow = document.querySelector(
    ".hour"
  ) as HTMLDivElement;
  const wrap = document.querySelector(".wrap") as HTMLDivElement;
  const resultDiv = document.getElementById("results") as HTMLDivElement;

  const lastState = { minutes: 0, hours: 0, airtime: 0 };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const minutesRaw = data.get("minutes");
    const hoursRaw = data.get("hours");
    const airtimeRaw = data.get("airtime");

    if (
      typeof minutesRaw !== "string" ||
      typeof hoursRaw !== "string" ||
      typeof airtimeRaw !== "string"
    ) {
      return;
    }

    const a = Number(hoursRaw); // hour input
    const b = Number(minutesRaw); // minute input
    const c = Number(airtimeRaw); // airtime

    if (
      lastState.minutes === b &&
      lastState.hours === a &&
      lastState.airtime === c
    ) {
      return;
    }

    // current angles in DEGREES
    const currentMinuteDeg = b * 6;
    const currentHourDeg = a * 30 + b * 0.5;

    calculationMinuteArrow.style.transform = `rotate(${currentMinuteDeg}deg)`;
    calculationHourArrow.style.transform = `rotate(${currentHourDeg}deg)`;

    // store last values if you actually want the guard to work
    lastState.minutes = b;
    lastState.hours = a;
    lastState.airtime = c;

    // pass DEGREES into currentPost
    setTimeout(
      () =>
        addTime(c, a * 60 + b, {
          minutes: currentMinuteDeg,
          hours: currentHourDeg,
        }),
      2000
    );
  });

  function addTime(
    airTime: number,
    currentTime: number,
    currentPost: { hours: number; minutes: number } = { hours: 0, minutes: 0 }
  ) {
    // a nice animation effect
    wrap.classList.add("resizing");
    setTimeout(() => wrap.classList.remove("resizing"), 1000);
    const totalMinutes = airTime + currentTime;

    const hoursPassed = Math.floor(totalMinutes / 60) % 24;
    const minutesPassed = totalMinutes % 60;

    // target rotation
    let newHourRot = hoursPassed * 30 + minutesPassed * 0.5;
    let newMinuteRot = minutesPassed * 6;

    // set
    const currentHourRot = currentPost.hours;
    const currentMinuteRot = currentPost.minutes;

    // --- FORCE FORWARD ROTATION (always go to a larger degree value) ---
    while (newHourRot <= currentHourRot) newHourRot += 360;
    while (newMinuteRot <= currentMinuteRot) newMinuteRot += 360;

    // --- APPLY ---
    calculationHourArrow.style.transform = `rotate(${newHourRot}deg)`;
    calculationMinuteArrow.style.transform = `rotate(${newMinuteRot}deg)`;

    // --- OUTPUT TEXT ---
    const hh = String(hoursPassed).padStart(2, "0");
    const mm = String(minutesPassed).padStart(2, "0");

    resultDiv.innerHTML = `
      <p class="text-xs text-slate-400">
        Time after delivery: <span class="font-semibold text-slate-100">${hh}:${mm}</span>
      </p>
    `;
  }
};
