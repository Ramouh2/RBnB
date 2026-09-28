import type { LucideIcon } from "lucide-react";

export interface RbnbCommand {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  /** Mots-clés supplémentaires pour la recherche instantanée. */
  keywords?: string[];
  /** Raccourci affiché (purement visuel). */
  shortcut?: string[];
  /** Action exécutée ; une promesse maintient l'état « action » en cours d'exécution. */
  onSelect?: () => void | Promise<void>;
  /** Message affiché dans la pilule d'action après succès. */
  successMessage?: string;
}

export type CommandTone = "info" | "success" | "warning" | "error";

export interface CommandNotification {
  /** Un nouvel identifiant déclenche l'affichage de la notification. */
  id: string;
  title: string;
  description?: string;
  tone?: CommandTone;
  icon?: LucideIcon;
}

export type CommandBarMode = "compact" | "open" | "action";

export interface CommandActionState {
  title: string;
  description?: string;
  status: "running" | "done" | "error";
  tone: CommandTone;
  icon?: LucideIcon;
}
