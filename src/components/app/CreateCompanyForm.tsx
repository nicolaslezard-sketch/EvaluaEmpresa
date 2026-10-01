"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

export type CreateCompanyFormState = {
  formError: string | null;
  fieldErrors: {
    name?: string;
    thirdPartyType?: string;
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
      {pending ? "Creando..." : "Crear tercero"}
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
  const [thirdPartyType, setThirdPartyType] = useState("");
  const [trade, setTrade] = useState("");
  const [taxId, setTaxId] = useState("");
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
          Empresa / razón social *
        </label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={state.fieldErrors.name ? "true" : "false"}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Ej: Hormigones Delta SA"
          disabled={disabled}
        />
        {state.fieldErrors.name ? (
          <p className="mt-2 text-sm text-red-600">{state.fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Tipo de tercero *
        </label>
        <select
          name="thirdPartyType"
          required
          value={thirdPartyType}
          onChange={(e) => setThirdPartyType(e.target.value)}
          aria-invalid={state.fieldErrors.thirdPartyType ? "true" : "false"}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          disabled={disabled}
        >
          <option value="">Seleccionar</option>
          <option value="SUPPLIER">Proveedor</option>
          <option value="CONTRACTOR">Contratista</option>
          <option value="SUBCONTRACTOR">Subcontratista</option>
          <option value="OTHER">Otro</option>
        </select>
        {state.fieldErrors.thirdPartyType ? (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.thirdPartyType}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Rubro</label>
        <input
          name="trade"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Ej: Hormigón, electricidad, ascensores..."
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">CUIT / identificación fiscal</label>
        <input
          name="taxId"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          placeholder="Ej: 30-12345678-9"
          disabled={disabled}
        />
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
          placeholder="Contexto breve sobre el proveedor o contratista."
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
