// Small enhancements. The site works without this file: every tab's content is
// simply shown one after another.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Tabs ----------
// Every <section class="panel" data-tab="Name" id="name"> inside [data-tabs] becomes a tab.

function setupTabs(root) {
  const panels = [...root.querySelectorAll(":scope > .panel[data-tab]")];
  if (panels.length < 2) return;

  const list = document.createElement("div");
  list.className = "tablist";
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", "Sections");

  const tabs = panels.map((panel) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab";
    tab.id = `tab-${panel.id}`;
    tab.textContent = panel.dataset.tab;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    list.append(tab);
    return tab;
  });

  root.prepend(list);
  root.classList.add("has-tabs");

  function select(index, { updateHash = false, focus = false } = {}) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
    if (updateHash) history.replaceState(null, "", `#${panels[index].id}`);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      select(i, { updateHash: true });
      // Keep the tab bar in view when switching from far down the page.
      if (list.getBoundingClientRect().top < 0) {
        list.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
    tab.addEventListener("keydown", (event) => {
      const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      select((keys[event.key] + tabs.length) % tabs.length, { updateHash: true, focus: true });
    });
  });

  // Open the tab named in the URL (#systems), or the tab that contains the
  // linked element (#pathfinding), and scroll to it.
  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    const index = target ? panels.findIndex((p) => p === target || p.contains(target)) : -1;
    if (index === -1) return false;
    select(index);
    if (target !== panels[index]) target.scrollIntoView();
    return true;
  }

  if (!fromHash()) select(0);
  window.addEventListener("hashchange", fromHash);
}

document.querySelectorAll("[data-tabs]").forEach(setupTabs);

// ---------- Systems table of contents ----------
// A list of every system on the side, when a tab documents two or more.

document.querySelectorAll(".systems").forEach((container) => {
  const systems = [...container.querySelectorAll(":scope > .system[id]")];
  if (systems.length < 2) return;

  const nav = document.createElement("nav");
  nav.className = "system-toc";
  nav.setAttribute("aria-label", "On this tab");
  const list = document.createElement("ol");
  const links = systems.map((system) => {
    const title = system.querySelector(".system-title");
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${system.id}`;
    link.textContent = title ? title.textContent : system.id;
    item.append(link);
    list.append(item);
    return link;
  });
  nav.append(list);
  container.prepend(nav);
  container.classList.add("systems--with-toc");

  const body = document.createElement("div");
  systems.forEach((system) => body.append(system));
  container.append(body);

  // Highlight the system currently being read.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = systems.indexOf(entry.target);
        links.forEach((link, j) => link.setAttribute("aria-current", String(i === j)));
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  systems.forEach((system) => observer.observe(system));
});

// ---------- Video ----------
// Card clips play while hovered or focused. Featured and hero clips autoplay
// (unless the visitor prefers reduced motion) and get a pause / play button.

document.querySelectorAll("video[data-hover-play]").forEach((video) => {
  if (reduceMotion) return;
  const card = video.closest(".card") || video;
  const play = () => video.play().catch(() => {});
  const stop = () => {
    video.pause();
    video.currentTime = 0;
  };
  card.addEventListener("mouseenter", play);
  card.addEventListener("focus", play);
  card.addEventListener("mouseleave", stop);
  card.addEventListener("blur", stop);
});

document.querySelectorAll("video[data-autoplay]").forEach((video) => {
  if (reduceMotion) {
    video.removeAttribute("autoplay");
    video.pause();
  }
  const host = video.closest(".featured-media, .hero-media") || video.parentElement;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "media-toggle";
  const update = () => {
    toggle.textContent = video.paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", `${video.paused ? "Play" : "Pause"} gameplay clip`);
  };
  toggle.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener("play", update);
  video.addEventListener("pause", update);
  update();
  host.append(toggle);
});

// ---------- Lightbox for gallery screenshots ----------

const galleryLinks = document.querySelectorAll("a[data-lightbox]");
if (galleryLinks.length && "HTMLDialogElement" in window) {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = '<button type="button" class="lightbox-close">Close</button><img alt="" />';
  document.body.append(dialog);
  const img = dialog.querySelector("img");

  galleryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const thumb = link.querySelector("img");
      img.src = link.href;
      img.alt = thumb ? thumb.alt : "";
      dialog.showModal();
    });
  });
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
