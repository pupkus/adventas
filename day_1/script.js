import { initiateMetadata } from "../script.js";
const containerCap = 250; // cap for width and length in px
const defaultInput = 5; // meters
const defaultScale = 40; // px per meter (before scaling to fit)
const defaultPrice = 1; // coins per m²
const extra = 0.05; // +5% extra area
const lastState = { length: defaultInput, width: defaultInput }; // to prevent unnecessary animation
const priceInput = document.querySelector("[data-price]");
const form = document.getElementById("form");
window.onload = () => {
    initiateMetadata();
    // set default dimensions
    document.querySelectorAll("[data-dimensions]").forEach((input) => {
        input.value = String(defaultInput);
    });
    // default price
    priceInput.value = String(defaultPrice);
    // initial rectangle + calculation
    resizeRectangle(defaultInput * defaultScale, defaultInput * defaultScale, defaultInput, defaultInput);
    calculate(String(defaultInput), String(defaultInput));
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const length = data.get("length");
        const width = data.get("width");
        const price = data.get("price");
        if (typeof length !== "string" || typeof width !== "string" || typeof price !== "string") {
            alert("Please provide valid inputs.");
            return;
        }
        if (!length || !width || !price) {
            alert("Length and width must not be empty.");
            return;
        }
        if (isNaN(Number(length)) ||
            isNaN(Number(width)) ||
            isNaN(Number(price)) ||
            Number(length) <= 0 ||
            Number(width) <= 0 ||
            Number(price) <= 0) {
            alert("Invalid values.");
            return;
        }
        drawRectangle(length, width);
        calculate(length, width);
    });
};
function resizeRectangle(boxWidth, boxLength, width, length) {
    const rectangle = document.querySelector(".rectangle");
    rectangle.style.width = `${boxWidth}px`;
    rectangle.style.height = `${boxLength}px`;
    // side labels
    rectangle.style.setProperty("--before-content", `"${length} m"`);
    rectangle.style.setProperty("--after-content", `"${width} m"`);
    const area = width * length;
    rectangle.textContent = `${area} m²`;
    // a nice animation effect
    if (!(lastState.length === length && lastState.width === width)) {
        rectangle.classList.add("resizing");
        setTimeout(() => rectangle.classList.remove("resizing"), 300);
        lastState.length = length;
        lastState.width = width;
    }
}
function drawRectangle(length, width) {
    let lengthNum = Number(length) * defaultScale;
    let widthNum = Number(width) * defaultScale;
    if (Number.isNaN(lengthNum) || Number.isNaN(widthNum))
        return;
    // scale down to fit container if exceeds cap
    if (lengthNum > containerCap || widthNum > containerCap) {
        const lengthScale = lengthNum / containerCap;
        const widthScale = widthNum / containerCap;
        const scale = Math.max(lengthScale, widthScale);
        lengthNum = lengthNum / scale;
        widthNum = widthNum / scale;
    }
    resizeRectangle(widthNum, lengthNum, Number(width), Number(length));
}
function formatMoney(value, locale = "lt-LT") {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
function calculate(length, width) {
    const resultDiv = document.getElementById("results");
    const lengthNum = Number(length);
    const widthNum = Number(width);
    const area = lengthNum * widthNum;
    const m2price = Number(priceInput.value);
    const baseCost = area * m2price;
    const total = baseCost * (1 + extra);
    resultDiv.innerHTML = `
    <p class="text-xs text-slate-400">
      Area: <span class="font-semibold text-slate-100">${area.toFixed(2)} m²</span>
    </p>
    <p class="text-xs text-slate-400">
      Price per m²: <span class="font-semibold text-slate-100">${formatMoney(m2price)} coins</span>
    </p>
    <p class="text-xs text-slate-400">
      Extra tiles: <span class="font-semibold text-slate-100">${(extra * 100).toFixed(0)}%</span>
    </p>
    <p class="pt-2 text-base font-semibold">
      Total cost: <span class="text-emerald-400">${formatMoney(total)} coins</span>
    </p>
  `;
}
