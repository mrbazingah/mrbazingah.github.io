// Small enhancements. The site works without this file.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Preview clips ----------
// WebM/MP4 previews loop while they're on screen and get a pause / play button.
// Visitors who prefer reduced motion start with them paused.

const clips = document.querySelectorAll("video[data-autoplay]");
const userPaused = new WeakSet();

const inView = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting && !userPaused.has(video) && !reduceMotion) video.play().catch(() => {});
      else if (!isIntersecting) video.pause();
    });
  },
  { threshold: 0.25 }
);

clips.forEach((video) => {
  if (reduceMotion) userPaused.add(video);
  inView.observe(video);

  // A link around the preview (home page) can't hold a button, so skip the toggle there.
  if (video.closest("a")) return;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "media-toggle";
  const update = () => {
    toggle.textContent = video.paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", `${video.paused ? "Play" : "Pause"} preview clip`);
  };
  toggle.addEventListener("click", () => {
    if (video.paused) {
      userPaused.delete(video);
      video.play().catch(() => {});
    } else {
      userPaused.add(video);
      video.pause();
    }
  });
  video.addEventListener("play", update);
  video.addEventListener("pause", update);
  update();
  video.parentElement.append(toggle);
});

// ---------- "How it works" ----------
// A link to something inside a closed section (e.g. /personal-projects/#pathfinding)
// opens that section and scrolls to it.

function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  const details = target && target.closest("details");
  if (!details) return;
  details.open = true;
  target.scrollIntoView();
}

openFromHash();
window.addEventListener("hashchange", openFromHash);
