type NavigationItem = {
  title: string;
  link: string;
  img: string;
};

const titleArray = [
  `Santa's Tiling Trouble`,
  "Santa’s Midnight Clock Countdown",
  "Santa’s Number-Trimming Magic",
  "Gift Bag",
  "Santa’s Magical ASCII Countdown",
  "Santa’s Sleigh Flight Schedule",
  "Santa’s Christmas Concert Seating Plan",
  "Christmas Lights Pattern Generator",
  "Santa’s Perfect Christmas Melon",
  "Santa’s Spinning Clock Mystery",
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
  content.className =
    "flex flex-col h-full w-full justify-center items-center text-white";

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

export async function initiateMetadata() {
  const nav = document.querySelector("nav") as HTMLElement | null;
  if (!nav) return;

  const data = await fetch("../nav.html");
  nav.classList.add(
    "w-full",
    "py-6",
    "p-6",
    "bg-slate-900",
    "flex",
    "justify-between",
    "items-center",
    "text-center",
    "gap-4"
  );
  nav.innerHTML = await data.text();

  const back = document.getElementById("back") as HTMLAnchorElement | null;
  const forward = document.getElementById(
    "forward"
  ) as HTMLAnchorElement | null;
  if (!back || !forward) return;

  const currentPath = window.location.pathname.replace(/\/+$/, ""); // strip trailing slash
  const segments = currentPath.split("/").filter(Boolean); // ["adventas", "day_1"]
  const currentFolder = segments[segments.length - 1]; // "day_1"
  const basePath = "/" + segments.slice(0, -1).join("/"); // "/adventas"

  const currentIndex = navigationItems.findIndex((item) => {
    const linkFolder = item.link.replace("./", "").replace(/\//g, ""); // "day_1"
    return linkFolder === currentFolder;
  });

  const currentItem = navigationItems[currentIndex];

  if (currentItem) {
    document.title = currentItem.title;
    const h1 = document.getElementById("page-title");
    if (h1) h1.textContent = currentItem.title;
  }

  // BACK
  if (currentIndex > 0) {
    const targetFolder = navigationItems[currentIndex - 1].link
      .replace("./", "")
      .replace(/\/+$/, ""); // "day_0" style
    back.href = `${basePath}/${targetFolder}/`.replace("//", "/"); // "/adventas/day_0/"
  } else {
    back.addEventListener("click", (e) => e.preventDefault());
    back.classList.add("opacity-40", "pointer-events-none", "cursor-default");
  }

  // FORWARD
  if (currentIndex > -1 && currentIndex < navigationItems.length - 1) {
    const targetFolder = navigationItems[currentIndex + 1].link
      .replace("./", "")
      .replace(/\/+$/, "");
    forward.href = `${basePath}${targetFolder}/`; // "/adventas/day_2/"
  } else {
    forward.addEventListener("click", (e) => e.preventDefault());
    forward.classList.add(
      "opacity-40",
      "pointer-events-none",
      "cursor-default"
    );
  }
}
