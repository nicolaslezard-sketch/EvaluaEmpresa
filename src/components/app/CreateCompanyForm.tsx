"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

export type CreateCompanyFormState = {
  formError: string | null;
  fieldErrors: {
    name?: string;
    relationType?: string;
    description?: string;
  };
};

type Props = {
  action: (
    prevState: CreateCompanyFormState,
    formData: FormData,
  ) => Promise<CreateCompanyFormState>;
  descriptionMaxLength: number;
  disabled?: boolean;
};

const INITIAL_STATE: CreateCompanyFormState = {
  formError: null,
  fieldErrors: {},
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Creando..." : "Crear empresa"}
    </button>
  );
}

export function CreateCompanyForm({
  action,
  descriptionMaxLength,
  disabled = false,
}: Props) {
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [sector, setSector] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");

  const remainingDescriptionChars = useMemo(
    () => descriptionMaxLength - description.length,
    [description.length, descriptionMaxLength],
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
    >
      {state.formError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.formError}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Nombre de la empresa *
        </label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={state.fieldErrors.name ? "true" : "false"}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Ej: Constructora Delta SA"
          disabled={disabled}
        />
        {state.fieldErrors.name ? (
          <p className="mt-2 text-sm text-red-600">{state.fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Tipo de relación *
        </label>
        <select
          name="relationType"
          required
          value={relationType}
          onChange={(e) => setRelationType(e.target.value)}
          aria-invalid={state.fieldErrors.relationType ? "true" : "false"}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          disabled={disabled}
        >
          <option value="">Seleccionar</option>
          <option value="CLIENTE">Cliente</option>
          <option value="PROVEEDOR">Proveedor</option>
          <option value="SOCIO">Socio</option>
          <option value="OBJETIVO_ADQUISICION">Objetivo de adquisición</option>
        </select>
        {state.fieldErrors.relationType ? (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.relationType}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Sector
        </label>
        <input
          name="sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Ej: Construcción, logística, software..."
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Tamaño
        </label>
        <select
          name="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          disabled={disabled}
        >
          <option value="">Seleccionar</option>
          <option value="MICRO">Micro</option>
          <option value="PEQUENA">Pequeña</option>
          <option value="MEDIANA">Mediana</option>
          <option value="GRANDE">Grande</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-zinc-700">
            Descripción
          </label>
          <span
            className={`text-xs ${
              remainingDescriptionChars < 30
                ? "text-amber-600"
                : "text-zinc-500"
            }`}
          >
            {description.length}/{descriptionMaxLength}
          </span>
        </div>

        <textarea
          name="description"
          rows={4}
          maxLength={descriptionMaxLength}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={state.fieldErrors.description ? "true" : "false"}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Contexto breve para identificar mejor a la empresa."
          disabled={disabled}
        />

        <div className="mt-2 text-xs text-zinc-500">
          Máximo {descriptionMaxLength} caracteres.
        </div>

        {state.fieldErrors.description ? (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton disabled={disabled} />
        <a href="/dashboard" className="btn btn-secondary">
          Volver
        </a>
      </div>
    </form>
  );
}
