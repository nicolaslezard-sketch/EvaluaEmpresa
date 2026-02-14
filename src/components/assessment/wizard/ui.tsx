"use client";

import * as React from "react";

export type FieldErrors = Record<string, string | undefined>;

export function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-zinc-900">{children}</div>;
}

export function Hint({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-zinc-600">{children}</div>;
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-red-600">{children}</div>;
}

export function Field({
  fieldKey,
  label,
  hint,
  errors,
  children,
}: {
  fieldKey?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errors?: FieldErrors;
  children: React.ReactNode;
}) {
  const err = fieldKey ? errors?.[fieldKey] : undefined;

  return (
    <div className="space-y-1">
      {label ? <Label>{label}</Label> : null}
      {hint ? <Hint>{hint}</Hint> : null}

      <div
        data-field={fieldKey}
        className={cn(err && "rounded-xl ring-1 ring-red-500")}
      >
        {children}
      </div>

      {err ? <ErrorText>{err}</ErrorText> : null}
    </div>
  );
}

const baseInput =
  "w-full rounded-xl border bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none";
const okBorder = "border-zinc-200 focus:border-zinc-400";
const badBorder = "border-red-500 focus:border-red-500";

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean },
) {
  const { invalid, className, ...rest } = props;
  return (
    <input
      {...rest}
      className={cn(baseInput, invalid ? badBorder : okBorder, className)}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean },
) {
  const { invalid, className, ...rest } = props;
  return (
    <select
      {...rest}
      className={cn(baseInput, invalid ? badBorder : okBorder, className)}
    />
  );
}

/**
 * Textarea con min/max + contador visible.
 * - Muestra helper
 * - Muestra contador y marca en rojo si excede max
 */
export function TextareaField({
  fieldKey,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  rows = 5,
  placeholder,
  errors,
}: {
  fieldKey: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  rows?: number;
  placeholder?: string;
  errors?: FieldErrors;
}) {
  const err = errors?.[fieldKey];
  const len = value?.length ?? 0;
  const over = typeof max === "number" ? len > max : false;

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {hint ? <Hint>{hint}</Hint> : null}

      <div
        data-field={fieldKey}
        className={cn(err && "rounded-xl ring-1 ring-red-500")}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            baseInput,
            "min-h-30 resize-y",
            err ? badBorder : okBorder,
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-600">
          {typeof min === "number" ? `Mín: ${min} caracteres` : null}
          {typeof min === "number" && typeof max === "number" ? " · " : null}
          {typeof max === "number" ? `Máx: ${max} caracteres` : null}
        </div>
        <div className={cn("text-xs", over ? "text-red-600" : "text-zinc-600")}>
          {len}
          {typeof max === "number" ? ` / ${max}` : null}
        </div>
      </div>

      {err ? <ErrorText>{err}</ErrorText> : null}
    </div>
  );
}

/**
 * CheckboxGroup para arrays (Step 4 y similares).
 * Importante: NO forzamos defaults dentro de onChange.
 */
export function CheckboxGroup<T extends string>({
  fieldKey,
  label,
  hint,
  value,
  options,
  onChange,
  errors,
}: {
  fieldKey: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: T[];
  options: Array<{ value: T; label: string }>;
  onChange: (next: T[]) => void;
  errors?: FieldErrors;
}) {
  const err = errors?.[fieldKey];

  function toggle(v: T) {
    const has = value.includes(v);
    const next = has ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint ? <Hint>{hint}</Hint> : null}

      <div
        data-field={fieldKey}
        className={cn(
          "grid gap-2 rounded-xl border bg-white p-3",
          err ? "border-red-500" : "border-zinc-200",
        )}
      >
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 text-sm text-zinc-800"
          >
            <input
              type="checkbox"
              checked={value.includes(o.value)}
              onChange={() => toggle(o.value)}
              className="h-4 w-4"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      {err ? <ErrorText>{err}</ErrorText> : null}
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}
