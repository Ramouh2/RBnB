"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type Ref,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CircleAlert, Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { LogoMark } from "@/components/ui/Logo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_COMMAND_BAR_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  toSpring,
  withOverride,
  type CommandBarConfig,
} from "@/lib/motion/constants";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-bar/CommandPalette";
import { LiquidSpinner } from "./liquid/LiquidSpinner";
import type {
  CommandActionState,
  CommandBarMode,
  CommandNotification,
  CommandTone,
  RbnbCommand,
} from "./command-bar/types";

export type { CommandNotification, RbnbCommand } from "./command-bar/types";

export interface MorphingCommandBarHandle {
  open: () => void;
  close: () => void;
  /** Notification temps réel : la barre morphe en pilule de notification puis se rétracte. */
  notify: (notification: CommandNotification) => void;
}

export interface MorphingCommandBarProps {
  commands: RbnbCommand[];
  ref?: Ref<MorphingCommandBarHandle>;
  /** `floating` : fixée au viewport ; `inline` : confinée à son conteneur (playground). */
  placement?: "floating" | "inline";
  placeholder?: string;
  /** Active le raccourci global ⌘K / Ctrl+K. */
  hotkey?: boolean;
  className?: string;
  configOverride?: Partial<CommandBarConfig>;
  onModeChange?: (mode: CommandBarMode) => void;
}

const TONE_CLASSES: Record<CommandTone, string> = {
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

function subscribeNoop() {
  return () => {};
}

function useIsApple() {
  return useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent),
    () => true,
  );
}

/**
 * Barre de commande flottante de RBnB (Dynamic Island × Raycast × ⌘K).
 * compact → open → action : une seule enveloppe partagée (`layoutId`) se transforme et voyage
 * dans l'espace, ressort stiffness 400 / damping 28.
 */
export function MorphingCommandBar({
  commands,
  ref,
  placement = "floating",
  placeholder = "Rechercher une commande RBnB…",
  hotkey = true,
  className,
  configOverride,
  onModeChange,
}: MorphingCommandBarProps) {
  const config = withOverride(RBNB_COMMAND_BAR_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const isApple = useIsApple();
  const uid = `rbnb-cmd-${useId().replace(/:/g, "")}`;
  const shellId = `${uid}-shell`;

  const [mode, setModeState] = useState<CommandBarMode>("compact");
  const [action, setAction] = useState<CommandActionState | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transition = reduced ? RBNB_REDUCED_TRANSITION : toSpring(config);

  const setMode = (next: CommandBarMode) => {
    setModeState(next);
    onModeChange?.(next);
  };

  const clearTimer = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = null;
  };

  const scheduleCollapse = () => {
    clearTimer();
    dismissTimer.current = setTimeout(() => setMode("compact"), config.duration);
  };

  useEffect(() => clearTimer, []);

  const open = () => {
    clearTimer();
    setMode("open");
  };

  const close = () => {
    setMode("compact");
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  const notify = (notification: CommandNotification) => {
    if (mode === "open") return;
    setAction({
      title: notification.title,
      description: notification.description,
      status: "done",
      tone: notification.tone ?? "info",
      icon: notification.icon ?? Bell,
    });
    setMode("action");
    scheduleCollapse();
  };

  useImperativeHandle(ref, () => ({ open, close, notify }));

  // Raccourci global ⌘K / Ctrl+K.
  const onHotkey = useEffectEvent(() => {
    if (mode === "open") close();
    else open();
  });

  useEffect(() => {
    if (!hotkey) return;
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onHotkey();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkey]);

  const run = async (command: RbnbCommand) => {
    clearTimer();
    setAction({ title: command.label, status: "running", tone: "info", icon: command.icon });
    setMode("action");
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    try {
      await command.onSelect?.();
      setAction({
        title: command.label,
        description: command.successMessage ?? "Commande exécutée",
        status: "done",
        tone: "success",
        icon: command.icon,
      });
    } catch {
      setAction({ title: command.label, description: "La commande a échoué", status: "error", tone: "error" });
    }
    scheduleCollapse();
  };

  const floating = placement === "floating";
  const anchor = floating ? "fixed" : "absolute";

  return (
    <div className={cn(!floating && "relative h-[440px] w-full overflow-hidden", className)}>
      <AnimatePresence>
        {mode === "open" && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            className={cn(anchor, "inset-0 z-[var(--z-command-bar)] bg-black")}
            initial={{ opacity: 0 }}
            animate={{ opacity: config.backdrop }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Ancre basse : états compact & action */}
      <div
        className={cn(
          anchor,
          "pointer-events-none inset-x-0 z-[var(--z-command-bar)] flex justify-center px-4",
          floating ? "bottom-[max(1.25rem,env(safe-area-inset-bottom))]" : "bottom-5",
        )}
      >
        {mode !== "open" && (
          <motion.div
            layoutId={shellId}
            layout
            transition={transition}
            style={{ borderRadius: 999 }}
            className="surface-elevated pointer-events-auto overflow-hidden shadow-lg"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "compact" ? (
                <motion.button
                  key="compact"
                  ref={triggerRef}
                  type="button"
                  layout="position"
                  onClick={open}
                  aria-haspopup="dialog"
                  aria-label="Ouvrir la palette de commandes RBnB"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.16, delay: 0.05 } }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-11 items-center gap-2.5 pl-2 pr-3 text-sm text-fg-secondary transition-tint hover:text-fg focus-visible:outline-none"
                >
                  <LogoMark size={26} />
                  <span className="font-semibold text-fg">RBnB</span>
                  <span className="h-4 w-px bg-edge" aria-hidden="true" />
                  <Search className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Rechercher</span>
                  <span className="hidden items-center gap-1 sm:flex">
                    <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </motion.button>
              ) : (
                <ActionPill key="action" action={action} onClick={open} buttonRef={triggerRef} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Ancre haute : palette ouverte (loin du clavier virtuel mobile) */}
      <div
        className={cn(
          anchor,
          "pointer-events-none inset-x-0 z-[var(--z-command-bar)] flex justify-center px-4",
          floating ? "top-[10svh]" : "top-5",
        )}
      >
        {mode === "open" && (
          <motion.div
            layoutId={shellId}
            layout
            transition={transition}
            role="dialog"
            aria-modal="true"
            aria-label="Palette de commandes RBnB"
            style={{ borderRadius: 20 }}
            className="surface-elevated pointer-events-auto w-full max-w-lg overflow-hidden bg-surface-1/95 shadow-lg"
          >
            <CommandPalette
              uid={uid}
              commands={commands}
              placeholder={placeholder}
              transition={transition}
              onRun={run}
              onClose={close}
            />
          </motion.div>
        )}
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {mode === "action" && action ? `${action.title}${action.description ? ` — ${action.description}` : ""}` : ""}
      </span>
    </div>
  );
}

interface ActionPillProps {
  action: CommandActionState | null;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

function ActionPill({ action, onClick, buttonRef }: ActionPillProps) {
  if (!action) return null;
  const Icon = action.icon;
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      layout="position"
      onClick={onClick}
      aria-label="Ouvrir la palette de commandes RBnB"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18, delay: 0.06 } }}
      exit={{ opacity: 0, transition: { duration: 0.08 } }}
      whileTap={{ scale: 0.97 }}
      className="flex min-h-14 items-center gap-3 py-2 pl-2.5 pr-5 text-left focus-visible:outline-none"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-edge-subtle bg-surface-2",
          TONE_CLASSES[action.tone],
        )}
      >
        {action.status === "running" ? (
          <LiquidSpinner size={18} />
        ) : action.status === "error" ? (
          <CircleAlert className="size-4" aria-hidden="true" />
        ) : action.tone === "success" ? (
          <Check className="size-4" aria-hidden="true" />
        ) : Icon ? (
          <Icon className="size-4" aria-hidden="true" />
        ) : (
          <Bell className="size-4" aria-hidden="true" />
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="max-w-[60vw] truncate text-sm font-medium text-fg sm:max-w-xs">{action.title}</span>
        <span className="max-w-[60vw] truncate text-xs text-fg-muted sm:max-w-xs">
          {action.status === "running" ? "Exécution en cours…" : action.description}
        </span>
      </span>
    </motion.button>
  );
}
