"use client";

import { useId } from "react";

export interface ControlSpec<K extends string> {
  key: K;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

function decimalsOf(step: number) {
  return (step.toString().split(".")[1] ?? "").length;
}

/** Contrôle de calibration du Motion Lab : range natif (accessible clavier) + valeur tabulaire. */
export function ControlSlider({ label, value, min, max, step, unit, onChange }: ControlSliderProps) {
  const id = useId();
  const progress = ((value - min) / (max - min || 1)) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-fg-secondary">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-xs tabular-nums text-fg">
          {value.toFixed(decimalsOf(step))}
          {unit && <span className="ml-0.5 text-fg-muted">{unit}</span>}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rbnb-range h-6 w-full cursor-pointer appearance-none bg-transparent"
        style={{ ["--rbnb-range-progress" as string]: `${progress}%` }}
      />
    </div>
  );
}
