import { ArrowUpRight, Copy, CornerDownLeft, Hash, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NAV, PROJECTS, SITE } from "../data/site.js";

function buildActions(close) {
  const go = (id) => () => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const open = (url) => () => {
    close();
    window.open(url, "_blank", "noopener");
  };
  return [
    ...NAV.map(({ id, label }) => ({ group: "Go to", label, icon: Hash, run: go(id) })),
    {
      group: "Contact",
      label: "Copy email address",
      hint: SITE.email,
      icon: Copy,
      run: () => {
        navigator.clipboard?.writeText(SITE.email);
        close();
      },
    },
    { group: "Contact", label: "Open LinkedIn", icon: ArrowUpRight, run: open(SITE.linkedin) },
    { group: "Contact", label: "Open GitHub", icon: ArrowUpRight, run: open(SITE.github) },
    ...PROJECTS.map((project) => ({
      group: "Repositories",
      label: project.title,
      hint: project.kicker,
      icon: ArrowUpRight,
      run: open(project.repo),
    })),
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  const close = () => setOpen(false);
  const actions = useMemo(() => buildActions(close), []);
  const results = actions.filter((action) =>
    `${action.group} ${action.label} ${action.hint ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onRequest = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onRequest);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      returnFocus.current?.focus?.();
    }
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((value) => Math.min(results.length - 1, value + 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((value) => Math.max(0, value - 1));
    }
    if (event.key === "Enter" && results[index]) results[index].run();
  };

  let lastGroup = null;
  return (
    <div className="palette-backdrop" onMouseDown={close}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="palette-search">
          <Search size={16} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            placeholder="Jump to a section, a repository or contact"
            aria-label="Search commands"
            aria-controls="palette-results"
            aria-activedescendant={results[index] ? `palette-item-${index}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-results" id="palette-results" role="listbox">
          {results.map((action, position) => {
            const Icon = action.icon;
            const header = action.group !== lastGroup ? action.group : null;
            lastGroup = action.group;
            return (
              <li key={`${action.group}-${action.label}`} role="presentation">
                {header && <p className="palette-group">{header}</p>}
                <button
                  type="button"
                  id={`palette-item-${position}`}
                  role="option"
                  aria-selected={position === index}
                  className="palette-item"
                  onMouseEnter={() => setIndex(position)}
                  onClick={action.run}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span className="palette-label">{action.label}</span>
                  {action.hint && <span className="palette-hint">{action.hint}</span>}
                  {position === index && <CornerDownLeft size={14} aria-hidden="true" className="palette-enter" />}
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="palette-empty">Nothing matches “{query}”.</li>}
        </ul>
      </div>
    </div>
  );
}
