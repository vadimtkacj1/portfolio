import { useEffect, useRef } from "react";

const PAGE_NAMES = { "/": "Home", "/playground": "Playground" };

function internalPage(anchor) {
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const path = url.pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  const current = window.location.pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  if (path === current) return null;
  return { url: url.href, name: PAGE_NAMES[path] ?? "" };
}

export default function Curtain() {
  const counterRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const leave = () => {
      root.classList.add("curtain-leaving");
      window.setTimeout(() => root.classList.remove("is-loading", "is-entering", "curtain-leaving"), 1000);
    };

    if (root.classList.contains("is-loading")) {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 900);
        counterRef.current.textContent = String(Math.round((1 - (1 - progress) ** 3) * 100));
        if (progress < 1) requestAnimationFrame(tick);
        else window.setTimeout(leave, 120);
      };
      requestAnimationFrame(tick);
    } else if (root.classList.contains("is-entering")) {
      window.setTimeout(leave, 260);
    }

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const page = internalPage(event.target.closest("a"));
      if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      labelRef.current.textContent = page.name;
      root.classList.add("curtain-covering");
      window.setTimeout(() => {
        window.location.href = page.url;
      }, 650);
    };
    const onShow = (event) => {
      if (event.persisted) root.classList.remove("curtain-covering");
    };
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  return (
    <div className="curtain" aria-hidden="true">
      <div className="curtain-loading">
        <span className="curtain-caption">loading weights</span>
        <span className="curtain-counter">
          <span ref={counterRef}>0</span>%
        </span>
      </div>
      <span className="curtain-label" ref={labelRef} />
    </div>
  );
}
