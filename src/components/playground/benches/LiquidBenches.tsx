"use client";

import { useState } from "react";
import { LiquidLogin, type LiquidLoginStage } from "@/components/auth/LiquidLogin";
import { LiquidAuthInput } from "@/components/motion/LiquidAuthInput";
import { RBNB_LIQUID_DEFAULTS, type LiquidConfig } from "@/lib/motion/constants";
import { Bench, BenchButton, useBenchConfig } from "../Bench";
import type { ControlSpec } from "../ControlSlider";

const LIQUID_CONTROLS: ControlSpec<keyof LiquidConfig>[] = [
  { key: "stiffness", label: "stiffness (k)", min: 10, max: 300, step: 1 },
  { key: "damping", label: "damping", min: 2, max: 40, step: 0.5 },
  { key: "mass", label: "mass", min: 0.3, max: 3, step: 0.05 },
  { key: "neck", label: "NECK", min: 0.1, max: 0.9, step: 0.01 },
  { key: "pull", label: "PULL", min: 8, max: 44, step: 1, unit: "px" },
  { key: "gap", label: "écart final", min: 20, max: 64, step: 1, unit: "px" },
  { key: "blur", label: "blur (stdDeviation)", min: 2, max: 20, step: 0.5 },
  { key: "delay", label: "delay (auto)", min: 0, max: 2000, step: 50, unit: "ms" },
];

export function LiquidAuthInputBench() {
  const { config, set, reset } = useBenchConfig<LiquidConfig>(RBNB_LIQUID_DEFAULTS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expanded, setExpanded] = useState<boolean | undefined>(false);

  return (
    <Bench
      index={1}
      title="LiquidAuthInput"
      description="Séparation liquide Email → Password : le pont s'étire, s'affine jusqu'à NECK puis se détache à PULL."
      exportName="RBNB_LIQUID_DEFAULTS"
      config={config}
      controls={LIQUID_CONTROLS}
      onChange={set}
      onReset={reset}
      status={expanded === undefined ? "auto" : expanded ? "divisé" : "fusionné"}
      actions={
        <>
          <BenchButton active={expanded === true} onClick={() => setExpanded(true)}>
            Diviser
          </BenchButton>
          <BenchButton active={expanded === false} onClick={() => setExpanded(false)}>
            Fusionner
          </BenchButton>
          <BenchButton active={expanded === undefined} onClick={() => setExpanded(undefined)}>
            Auto (email valide)
          </BenchButton>
        </>
      }
    >
      <div className="w-full max-w-sm py-4">
        <LiquidAuthInput
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          expanded={expanded}
          configOverride={config}
        />
      </div>
    </Bench>
  );
}

const LOGIN_CONTROLS = LIQUID_CONTROLS.filter((control) => control.key !== "gap");

export function LiquidLoginBench() {
  const { config, set, reset } = useBenchConfig<LiquidConfig>(RBNB_LIQUID_DEFAULTS);
  const [stage, setStage] = useState<LiquidLoginStage>("EMAIL_STAGE");
  const [run, setRun] = useState(0);

  return (
    <Bench
      index={7}
      title="LiquidLogin"
      description="Login Animation V2 : barre unique → séparation Gooey (3 gouttes) → fusion → pilule → loading → succès. Mot de passe de test : « rbnb »."
      exportName="RBNB_LIQUID_DEFAULTS"
      config={config}
      controls={LOGIN_CONTROLS}
      onChange={set}
      onReset={reset}
      status={<span className="font-mono">{stage}</span>}
      actions={
        <BenchButton
          onClick={() => {
            setStage("EMAIL_STAGE");
            setRun((value) => value + 1);
          }}
        >
          Rejouer la démo
        </BenchButton>
      }
    >
      <div className="flex w-full max-w-sm flex-col items-center py-4">
        <LiquidLogin
          key={run}
          autoFocus={false}
          defaultEmail=""
          successDelay={1400}
          configOverride={config}
          onStageChange={setStage}
          onSubmit={async ({ password }) => {
            await new Promise((resolve) => setTimeout(resolve, 700));
            return password === "rbnb"
              ? { ok: true }
              : { ok: false, error: "Mot de passe incorrect (essayez « rbnb »).", field: "password" };
          }}
          onSuccess={() => {
            setStage("EMAIL_STAGE");
            setRun((value) => value + 1);
          }}
        />
      </div>
    </Bench>
  );
}
