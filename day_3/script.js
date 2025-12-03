import { initiateMetadata } from "../script.js";
window.onload = () => {
    initiateMetadata();
    let oldState;
    const form = document.getElementById("form");
    const digitsRow = document.querySelector(".digits");
    const digit_1 = document.getElementById("digit_1");
    const digit_2 = document.getElementById("digit_2");
    const digit_3 = document.getElementById("digit_3");
    const digit_4 = document.getElementById("digit_4");
    const trimmed_1 = document.getElementById("trimmed_1");
    const trimmed_2 = document.getElementById("trimmed_2");
    const trimmed_3 = document.getElementById("trimmed_3");
    const trimmed_4 = document.getElementById("trimmed_4");
    function setDigits(digits) {
        // main row
        digit_1.innerText = digits.charAt(0);
        digit_2.innerText = digits.charAt(1);
        digit_3.innerText = digits.charAt(2);
        digit_4.innerText = digits.charAt(3);
        // trimmed row
        trimmed_1.innerText = digits.charAt(0);
        trimmed_2.innerText = digits.charAt(1);
        trimmed_3.innerText = digits.charAt(2);
        trimmed_4.innerText = digits.charAt(3);
    }
    function playForwardAnimation() {
        // ensure we're in starting state visually
        trimmed_1.classList.remove("shadow");
        trimmed_4.classList.remove("shadow");
        trimmed_2.classList.remove("digit-collapse");
        trimmed_3.classList.remove("digit-collapse");
        trimmed_2.classList.add("digit");
        trimmed_3.classList.add("digit");
        digitsRow.classList.remove("drop-in");
        // force reflow so transitions restart cleanly
        void digitsRow.offsetWidth;
        // 1) drop the overlapped row down
        digitsRow.classList.add("drop-in");
        // 2) after the drop, collapse middle digits & highlight ends
        setTimeout(() => {
            trimmed_2.classList.remove("digit");
            trimmed_3.classList.remove("digit");
            trimmed_2.classList.add("digit-collapse");
            trimmed_3.classList.add("digit-collapse");
            trimmed_1.classList.add("shadow");
            trimmed_4.classList.add("shadow");
        }, 600);
    }
    function reverseThenAnimate(nextDigits) {
        // Step 1: reverse whatever state we’re in
        // remove highlight
        trimmed_1.classList.remove("shadow");
        trimmed_4.classList.remove("shadow");
        // expand middle digits back
        trimmed_2.classList.remove("digit-collapse");
        trimmed_3.classList.remove("digit-collapse");
        trimmed_2.classList.add("digit");
        trimmed_3.classList.add("digit");
        // move row back up
        digitsRow.classList.remove("drop-in");
        const onEnd = (event) => {
            if (event.target === digitsRow && event.propertyName === "top") {
                digitsRow.removeEventListener("transitionend", onEnd);
                // Step 2: when reversed, set digits and play forward anim
                setDigits(nextDigits);
                playForwardAnimation();
            }
        };
        // if top, skip straight to forward
        const top = getComputedStyle(digitsRow).top;
        if (top === "-142px") {
            setDigits(nextDigits);
            playForwardAnimation();
        }
        else {
            digitsRow.addEventListener("transitionend", onEnd);
        }
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const digits = data.get("digits");
        const input = form.elements.namedItem("digits");
        if (typeof digits !== "string" || digits.length !== 4 || !/^\d{4}$/.test(digits)) {
            input.setCustomValidity("The input must be a 4-digit number");
            input.reportValidity();
            return;
        }
        if (digits === oldState) {
            return;
        }
        oldState = digits;
        input.setCustomValidity("");
        // reverse → then animate with new digits
        reverseThenAnimate(digits);
    });
};
