type NavigationItem = {
  title: string;
  link: string;
  img: string;
};

const titleArray = [
  `Santa's Tiling Trouble`,
  "Santa’s Midnight Clock Countdown",
  "Santa’s Number-Trimming Magic",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
  "TBA",
];

const navigationItems: NavigationItem[] = titleArray.map((title, index) => ({
  title,
  link: `./day_${index + 1}/`,
  img: `./img/day_${index + 1}.png`,
}));

const cardContainer = document.getElementById("card-container");
navigationItems.forEach((item) => {
  const card = document.createElement("div");
  card.className =
    "nav-card relative overflow-hidden transform rounded-xl bg-white shadow-xl transition duration-300 hover:scale-105 cursor-pointer";

  card.style.backgroundImage = `url('${item.img}')`;
  card.style.backgroundSize = "cover";
  card.style.backgroundPosition = "center";

  const overlay = document.createElement("div");
  overlay.className = "absolute inset-0 bg-black/50";

  const link = document.createElement("a");
  link.href = item.link;
  link.className = "relative z-10 flex h-full w-full";

  const content = document.createElement("div");
  content.className = "flex flex-col h-full w-full justify-center items-center text-white";

  const titleHeading = document.createElement("h4");
  titleHeading.className =
    "block w-full font-bold text-center bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-md md:text-3xl sm:text-6xl lg:text-sm";
  titleHeading.textContent = item.title;

  content.appendChild(titleHeading);
  link.appendChild(content);
  overlay.appendChild(link);
  card.appendChild(overlay);
  cardContainer?.appendChild(card);
});

export function initiateMetadata() {
  const currentPath = window.location.pathname; // e.g. /adventas/day_1/
  const currentItem = navigationItems.find(
    (item) => currentPath.endsWith(item.link.replace("./", "")) // 'day_1/'
  );

  if (currentItem) {
    document.title = currentItem.title;

    const h1 = document.getElementById("page-title");
    if (h1) h1.textContent = currentItem.title;
  }
}
