"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationControls, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check, Lock, Mail } from "lucide-react";
import { LiquidField } from "@/components/motion/liquid/LiquidField";
import { LiquidSpinner } from "@/components/motion/liquid/LiquidSpinner";
import { LiquidSurface } from "@/components/motion/liquid/LiquidSurface";
import { LIQUID_BAR_HEIGHT } from "@/components/motion/liquid/geometry";
import { useLiquidSplit } from "@/components/motion/liquid/useLiquidSplit";
import { useElementWidth } from "@/hooks/useElementWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_LIQUID_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  RBNB_SPRINGS,
  withOverride,
  type LiquidConfig,
} from "@/lib/motion/constants";
import { shakeTransition } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validation";

export type LiquidLoginStage =
  | "EMAIL_STAGE"
  | "SPLITTING"
  | "PASSWORD_STAGE"
  | "MERGING"
  | "PILL"
  | "LOADING"
  | "SUCCESS";

export type LiquidLoginResult = { ok: true } | { ok: false; error: string; field?: "email" | "password" };

export interface LiquidLoginCredentials {
  email: string;
  password: string;
}

export interface LiquidLoginProps {
  /** Appel d'authentification réel (Server Action) — LiquidLogin n'est qu'une couche d'expérience. */
  onSubmit: (credentials: LiquidLoginCredentials) => Promise<LiquidLoginResult>;
  /** Déclenché après l'état succès (redirection vers le dashboard RBnB). */
  onSuccess?: () => void;
  onStageChange?: (stage: LiquidLoginStage) => void;
  defaultEmail?: string;
  autoFocus?: boolean;
  /** Durée d'affichage de l'état succès avant `onSuccess` (ms). */
  successDelay?: number;
  className?: string;
  configOverride?: Partial<LiquidConfig>;
}

const BUSY_STAGES: LiquidLoginStage[] = ["MERGING", "PILL", "LOADING", "SUCCESS"];

const ANNOUNCEMENTS: Record<LiquidLoginStage, string> = {
  EMAIL_STAGE: "",
  SPLITTING: "Champ mot de passe affiché",
  PASSWORD_STAGE: "Saisissez votre mot de passe RBnB",
  MERGING: "Connexion en cours",
  PILL: "Connexion en cours",
  LOADING: "Connexion en cours",
  SUCCESS: "Connexion réussie. Redirection vers votre dashboard RBnB.",
};

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Login Animation V2 de RBnB.
 * EMAIL_STAGE (barre blanche unique) → séparation verticale Gooey (pont, col NECK 0.34, rupture PULL 26,
 * 3 gouttes) → PASSWORD_STAGE → fusion → pilule compacte → loading → succès → redirection.
 */
export function LiquidLogin({
  onSubmit,
  onSuccess,
  onStageChange,
  defaultEmail = "",
  autoFocus = true,
  successDelay = 900,
  className,
  configOverride,
}: LiquidLoginProps) {
  const config = withOverride(RBNB_LIQUID_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const uid = useId();
  const messageId = `${uid}-message`;
  const [containerRef, width] = useElementWidth<HTMLDivElement>();

  const [stage, setStageState] = useState<LiquidLoginStage>("EMAIL_STAGE");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<"email" | "password" | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const busyRef = useRef(false);
  const stageRef = useRef<LiquidLoginStage>("EMAIL_STAGE");

  const { split, reveal, lowerY, animateSplit } = useLiquidSplit(config, reduced);
  const contraction = useMotionValue(0);
  const rowsOpacity = useMotionValue(1);
  const passwordOpacity = useTransform(() => reveal.get() * rowsOpacity.get());
  const shake = useAnimationControls();
  const pulse = useAnimationControls();

  const busy = BUSY_STAGES.includes(stage);
  const passwordVisible = stage !== "EMAIL_STAGE" && !busy;
  const spring = reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.default;

  /** Lecture non narrowée de l'étape courante (les flux async la font évoluer). */
  const currentStage = (): LiquidLoginStage => stageRef.current;

  const setStage = (next: LiquidLoginStage) => {
    stageRef.current = next;
    setStageState(next);
    onStageChange?.(next);
  };

  const fail = (message: string, field: "email" | "password") => {
    setError(message);
    setInvalidField(field);
    if (!reduced) void shake.start(shakeTransition());
    const target = field === "email" ? emailRef.current : passwordRef.current;
    requestAnimationFrame(() => {
      target?.focus({ preventScroll: true });
      target?.select();
    });
  };

  const continueToPassword = async (moveFocus: boolean) => {
    if (stageRef.current !== "EMAIL_STAGE" || busyRef.current) return;
    if (!isValidEmail(email)) {
      fail("Saisissez une adresse email valide.", "email");
      return;
    }
    setError(null);
    setInvalidField(null);
    setStage("SPLITTING");
    if (moveFocus) requestAnimationFrame(() => passwordRef.current?.focus({ preventScroll: true }));
    await animateSplit(1);
    if (currentStage() === "SPLITTING") setStage("PASSWORD_STAGE");
  };

  const backToEmail = async () => {
    if (stageRef.current !== "PASSWORD_STAGE" && stageRef.current !== "SPLITTING") return;
    setPassword("");
    setError(null);
    setInvalidField(null);
    setStage("EMAIL_STAGE");
    requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }));
    await animateSplit(0);
  };

  const submit = async () => {
    const current = stageRef.current;
    if (busyRef.current || (current !== "PASSWORD_STAGE" && current !== "SPLITTING")) return;
    if (!isValidEmail(email)) return fail("Saisissez une adresse email valide.", "email");
    if (password.length === 0) return fail("Saisissez votre mot de passe.", "password");

    // Verrou anti double-soumission immédiat.
    busyRef.current = true;
    setError(null);
    setInvalidField(null);

    // L'appel réseau part tout de suite ; la chorégraphie se joue en parallèle.
    const request = onSubmit({ email: email.trim(), password }).catch(
      (): LiquidLoginResult => ({ ok: false, error: "Connexion impossible. Réessayez dans un instant." }),
    );

    setStage("MERGING");
    passwordRef.current?.blur();
    void animate(rowsOpacity, 0, { duration: 0.16 });
    await animateSplit(0);
    setStage("PILL");
    await animate(contraction, 1, spring);
    setStage("LOADING");
    const [result] = await Promise.all([request, wait(reduced ? 150 : 480)]);

    if (result.ok) {
      setPassword("");
      setStage("SUCCESS");
      if (!reduced) void pulse.start({ scale: 1, transition: { ...RBNB_SPRINGS.bouncy, velocity: 1.6 } });
      await wait(successDelay);
      onSuccess?.();
      return;
    }

    // Échec : la pilule se redéploie en deux barres, secousse + message.
    await animate(contraction, 0, spring);
    void animate(rowsOpacity, 1, { duration: 0.2 });
    setStage("SPLITTING");
    await animateSplit(1);
    setStage("PASSWORD_STAGE");
    busyRef.current = false;
    fail(result.error, result.field ?? "password");
  };

  // Déploiement automatique : email valide + courte pause de frappe (le focus reste sur l'email).
  const onEmailSettled = useEffectEvent(() => {
    if (isValidEmail(email)) void continueToPassword(false);
  });

  useEffect(() => {
    if (!isValidEmail(email)) return;
    const timer = setTimeout(() => onEmailSettled(), config.delay);
    return () => clearTimeout(timer);
  }, [email, config.delay]);

  const successFill = stage === "SUCCESS" ? "#10b981" : "#f8fafc";

  return (
    <form
      noValidate
      aria-describedby={messageId}
      aria-busy={busy}
      onSubmit={(event) => {
        event.preventDefault();
        if (stageRef.current === "EMAIL_STAGE") void continueToPassword(true);
        else void submit();
      }}
      className={cn("relative w-full max-w-md", className)}
    >
      <motion.div animate={shake}>
        <motion.div
          ref={containerRef}
          animate={pulse}
          className="relative"
          style={{ height: LIQUID_BAR_HEIGHT * 2 + config.gap }}
        >
          {/* Halo de profondeur sous la barre blanche */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-16 -top-16 h-48"
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(129,140,248,0.22), transparent 70%)" }}
          />

          {width > 0 && (
            <LiquidSurface
              width={width}
              split={split}
              contraction={contraction}
              fill={successFill}
              config={config}
              reduced={reduced}
              lowerOpacity={reduced ? reveal : undefined}
            />
          )}

          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ y: lowerY, opacity: passwordOpacity }}
            inert={!passwordVisible}
            aria-hidden={!passwordVisible}
          >
            <LiquidField
              id={`${uid}-password`}
              inputRef={passwordRef}
              label="Mot de passe RBnB"
              icon={Lock}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={password}
              invalid={invalidField === "password"}
              aria-describedby={messageId}
              onChange={(event) => {
                setPassword(event.target.value);
                if (invalidField === "password") {
                  setInvalidField(null);
                  setError(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  void backToEmail();
                }
              }}
              trailing={
                <motion.button
                  type="submit"
                  aria-label="Se connecter à RBnB"
                  whileTap={{ scale: 0.96 }}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-0 text-fg transition-tint hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </motion.button>
              }
            />
          </motion.div>

          <motion.div className="absolute inset-x-0 top-0" style={{ opacity: rowsOpacity }} inert={busy} aria-hidden={busy}>
            <LiquidField
              id={`${uid}-email`}
              inputRef={emailRef}
              label="Adresse email RBnB"
              icon={Mail}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus={autoFocus}
              placeholder="Votre email RBnB..."
              value={email}
              invalid={invalidField === "email"}
              aria-describedby={messageId}
              fallbackSurface={width === 0}
              onChange={(event) => {
                setEmail(event.target.value);
                if (invalidField === "email") {
                  setInvalidField(null);
                  setError(null);
                }
              }}
              trailing={
                <AnimatePresence initial={false}>
                  {stage === "EMAIL_STAGE" && (
                    <motion.button
                      key="continue"
                      type="button"
                      aria-label="Continuer vers le mot de passe"
                      onClick={() => void continueToPassword(true)}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      whileTap={{ scale: 0.96 }}
                      transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.bouncy}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-0 text-fg transition-tint hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </motion.button>
                  )}
                </AnimatePresence>
              }
            />
          </motion.div>

          {/* Contenu de la pilule compacte : loading → succès */}
          <AnimatePresence>
            {(stage === "PILL" || stage === "LOADING" || stage === "SUCCESS") && (
              <motion.div
                key="pill"
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 flex h-14 items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {stage === "SUCCESS" ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.bouncy}
                      className="flex items-center gap-2 text-sm font-semibold text-white"
                    >
                      <Check className="size-5" strokeWidth={2.6} />
                    </motion.span>
                  ) : (
                    <motion.span key="loading" exit={{ opacity: 0, scale: 0.6 }} className="flex text-surface-0">
                      <LiquidSpinner size={26} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Zone de message à hauteur réservée : aucun layout shift */}
      <div id={messageId} className="mt-4 flex min-h-5 justify-center text-center text-sm" aria-live="assertive">
        <AnimatePresence mode="wait" initial={false}>
          {error && (
            <motion.p
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.snappy}
              className="font-medium text-error"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {ANNOUNCEMENTS[stage]}
      </span>
    </form>
  );
}
