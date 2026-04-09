"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  companyId: string;
  companyName: string;
};

const DELETE_CONFIRM_TEXT = "eliminar";

export function DeleteCompanyCard({ companyId, companyName }: Props) {
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deleteMatches = useMemo(
    () => deleteInput.trim() === DELETE_CONFIRM_TEXT,
    [deleteInput],
  );

  function openDeleteModal() {
    setDeleteInput("");
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (loadingDelete) return;
    setDeleteModalOpen(false);
    setDeleteInput("");
  }

  async function handleDeleteCompany() {
    if (!deleteMatches) return;

    try {
      setLoadingDelete(true);

      const res = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmationText: deleteInput,
        }),
      });

      const raw = await res.text();
      let data: { message?: string; error?: string } = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("La eliminación devolvió una respuesta inválida.");
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "No se pudo eliminar la empresa.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la empresa.",
      );
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
        <div className="text-sm font-semibold text-red-700">
          Eliminar empresa
        </div>

        <p className="mt-2 text-sm leading-6 text-red-700/90">
          Esta acción elimina la empresa{" "}
          <span className="font-semibold">{companyName}</span> y sus
          evaluaciones asociadas. No se puede deshacer.
        </p>

        <button
          type="button"
          onClick={openDeleteModal}
          className="mt-4 w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Eliminar empresa definitivamente
        </button>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/55 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="text-lg font-semibold text-zinc-900">
              Confirmar eliminación de empresa
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Esta acción elimina la empresa{" "}
              <span className="font-medium text-zinc-900">{companyName}</span>,
              sus evaluaciones y el historial asociado. No se puede deshacer.
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-700">
              Para confirmar, escribí{" "}
              <span className="font-semibold text-red-700">
                {DELETE_CONFIRM_TEXT}
              </span>
              .
            </p>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={DELETE_CONFIRM_TEXT}
              autoFocus
              className="mt-4 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />

            <div className="mt-2 text-xs text-zinc-500">
              El botón final solo se habilita si el texto coincide exactamente.
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={loadingDelete}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!deleteMatches || loadingDelete}
                onClick={handleDeleteCompany}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingDelete ? "Eliminando..." : "Eliminar empresa"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
