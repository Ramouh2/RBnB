"use client";

import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, type Transition } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/lib/utils";
import type { RbnbCommand } from "./types";

interface CommandPaletteProps {
  uid: string;
  commands: RbnbCommand[];
  placeholder: string;
  transition: Transition;
  onRun: (command: RbnbCommand) => void;
  onClose: () => void;
}

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Contenu de l'état « open » : recherche instantanée + navigation clavier (pattern combobox ARIA). */
export function CommandPalette({ uid, commands, placeholder, transition, onRun, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = `${uid}-list`;

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter((command) =>
      normalize([command.label, command.description ?? "", ...(command.keywords ?? [])].join(" ")).includes(q),
    );
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));
  const activeId = filtered[activeIndex] ? `${uid}-option-${filtered[activeIndex].id}` : undefined;

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((activeIndex + 1) % Math.max(filtered.length, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((activeIndex - 1 + filtered.length) % Math.max(filtered.length, 1));
        break;
      case "Enter": {
        event.preventDefault();
        const command = filtered[activeIndex];
        if (command) onRun(command);
        break;
      }
      case "Escape":
        event.preventDefault();
        onClose();
        break;
      case "Tab":
        // Le focus reste dans la palette (dialog modal) ; les options se parcourent aux flèches.
        event.preventDefault();
        break;
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.16, delay: 0.06 } }}
      className="flex w-full flex-col"
    >
      <div className="flex h-14 items-center gap-3 border-b border-edge-subtle px-4">
        <Search className="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label="Rechercher une commande RBnB"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-muted"
          spellCheck={false}
          autoComplete="off"
        />
        <Kbd className="hidden sm:inline-flex">Esc</Kbd>
      </div>

      <ul id={listId} role="listbox" aria-label="Commandes RBnB" className="max-h-[min(46svh,336px)] overflow-y-auto p-2">
        {filtered.map((command, index) => {
          const Icon = command.icon;
          const selected = index === activeIndex;
          return (
            <li
              key={command.id}
              id={`${uid}-option-${command.id}`}
              role="option"
              aria-selected={selected}
              onPointerMove={() => setActive(index)}
              onClick={() => onRun(command)}
              className={cn(
                "relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-tint",
                selected ? "text-fg" : "text-fg-secondary",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${uid}-highlight`}
                  transition={transition}
                  className="absolute inset-0 rounded-lg bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  aria-hidden="true"
                />
              )}
              <span className="relative flex size-7 items-center justify-center rounded-md border border-edge-subtle bg-surface-2">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="relative flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{command.label}</span>
                {command.description && <span className="truncate text-xs text-fg-muted">{command.description}</span>}
              </span>
              {command.shortcut && (
                <span className="relative hidden items-center gap-1 sm:flex">
                  {command.shortcut.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </span>
              )}
              {selected && <CornerDownLeft className="relative size-3.5 text-fg-muted" aria-hidden="true" />}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li role="presentation" className="px-3 py-8 text-center text-sm text-fg-muted">
            Aucune commande RBnB pour « {query} »
          </li>
        )}
      </ul>

      <div className="flex items-center justify-between border-t border-edge-subtle px-4 py-2.5 text-[11px] text-fg-muted">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> naviguer <Kbd className="ml-1.5">↵</Kbd> exécuter
        </span>
        <span className="font-medium tracking-wide text-fg-secondary">RBnB</span>
      </div>
    </motion.div>
  );
}
