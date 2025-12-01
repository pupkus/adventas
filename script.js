const navigationItems = [
    {
        title: `Santa's Tiling Trouble`,
        link: `/day_1/`,
        img: "/img/day_1.png",
    },
    {
        title: `TBA`,
        link: `/day_2/`,
        img: "/img/day_2.png",
    },
];
const cardContainer = document.getElementById("card-container");
navigationItems.forEach((item) => {
    // Create card container
    const card = document.createElement("div");
    card.className =
        "transform rounded-xl h-40 w-40 sm:h-48 sm:w-48 bg-white shadow-xl transition duration-300 hover:scale-105";
    // Set card background image
    card.style.backgroundImage = `url('${item.img}')`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-black/40"; // 40% opacity black layer
    // Create link
    const link = document.createElement("a");
    link.href = item.link;
    link.className = "relative z-10"; // keep text above overlay
    // Create content container
    const content = document.createElement("div");
    content.className = "flex flex-col h-full justify-center items-center text-white";
    // Add title
    const titleHeading = document.createElement("h4");
    titleHeading.className = "font-bold";
    titleHeading.textContent = item.title;
    // Assemble card
    content.appendChild(titleHeading);
    link.appendChild(content);
    overlay.appendChild(link);
    card.appendChild(overlay);
    cardContainer === null || cardContainer === void 0 ? void 0 : cardContainer.appendChild(card);
});
export function initiateMetadata() {
    const currentPath = window.location.pathname;
    const currentItem = navigationItems.find((item) => item.link === currentPath);
    if (currentItem) {
        document.title = currentItem.title;
        const h1 = document.getElementById("page-title");
        if (h1)
            h1.textContent = currentItem.title;
    }
}
