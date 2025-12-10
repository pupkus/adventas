import { initiateMetadata } from "../script.js";
window.onload = () => {
    initiateMetadata();
    const form = document.querySelector("form");
    const gridDisplay = document.getElementById("grid-display");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const length = formData.get("length");
        if (!length || isNaN(Number(length)) || Number(length) <= 0) {
            alert("Please enter a valid positive number for length.");
            return;
        }
        const gridSize = Number(length);
        gridDisplay.innerHTML = ""; // Clear previous grid if any
        // Create grid container
        const gridContainer = document.createElement("div");
        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridContainer.style.gap = "5px";
        // Populate grid with cells
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement("div");
            cell.style.border = "1px solid #000";
            cell.style.padding = "20px";
            cell.style.textAlign = "center";
            cell.textContent = (i + 1).toString();
            gridContainer.appendChild(cell);
        }
        gridDisplay.appendChild(gridContainer);
        // add grid-display classses and make it grid of
    });
};
