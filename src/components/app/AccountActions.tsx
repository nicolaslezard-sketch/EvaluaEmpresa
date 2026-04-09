"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { ReactivatePlanButton } from "@/components/billing/ReactivatePlanButton";

type Props = {
  canManageSubscription: boolean;
  canReactivateSubscription: boolean;
  canDeleteAccount: boolean;
  reactivationPlan?: "PRO" | "BUSINESS" | null;
};

const DELETE_CONFIRM_TEXT = "ELIMINAR";

export function AccountActions({
  canManageSubscription,
  canReactivateSubscription,
  canDeleteAccount,
  reactivationPlan,
}: Props) {
  const router = useRouter();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const deleteMatches = useMemo(
    () => deleteInput.trim() === DELETE_CONFIRM_TEXT,
    [deleteInput],
  );

  async function handleCancelSubscription() {
    const confirmed = window.confirm(
      "Vas a cancelar la renovación de tu suscripción. El acceso se mantendrá hasta el fin del período vigente si corresponde. ¿Querés continuar?",
    );

    if (!confirmed) return;

    try {
      setLoadingCancel(true);

      const res = await fetch("/api/billing/cancel", {
        method: "POST",
      });

      const raw = await res.text();
      let data: { message?: string; error?: string } = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("La cancelación devolvió una respuesta inválida.");
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "No se pudo cancelar la suscripción.",
        );
      }

      alert("La suscripción quedó cancelada correctamente.");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo cancelar la suscripción.",
      );
    } finally {
      setLoadingCancel(false);
    }
  }

  async function handleDeleteAccount() {
    if (!deleteMatches) return;

    try {
      setLoadingDelete(true);

      const res = await fetch("/api/account/delete", {
        method: "POST",
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
          data?.message || data?.error || "No se pudo eliminar la cuenta.",
        );
      }

      await signOut({ callbackUrl: "/" });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta.",
      );
    } finally {
      setLoadingDelete(false);
    }
  }

  function openDeleteModal() {
    setDeleteInput("");
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (loadingDelete) return;
    setDeleteModalOpen(false);
    setDeleteInput("");
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Cerrar sesión
        </button>

        {canReactivateSubscription && reactivationPlan ? (
          <ReactivatePlanButton
            plan={reactivationPlan}
            label={`Volver a activar ${
              reactivationPlan === "PRO" ? "Pro" : "Business"
            }`}
            className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        ) : null}

        {canManageSubscription ? (
          <>
            <Link
              href="/billing"
              className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Administrar plan o suscripción
            </Link>

            <button
              type="button"
              disabled={loadingCancel}
              onClick={handleCancelSubscription}
              className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm font-medium text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingCancel ? "Cancelando..." : "Cancelar suscripción"}
            </button>
          </>
        ) : !canReactivateSubscription ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            No tenés una suscripción paga activa para cancelar en este momento.
          </div>
        ) : null}

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="text-sm font-semibold text-red-700">
            Eliminar cuenta
          </div>
          <p className="mt-2 text-sm leading-6 text-red-700/90">
            Esta acción elimina la cuenta y los datos asociados. No se puede
            deshacer.
          </p>

          {canDeleteAccount ? (
            <button
              type="button"
              onClick={openDeleteModal}
              className="mt-4 w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Eliminar cuenta definitivamente
            </button>
          ) : (
            <div className="mt-4 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
              No podés eliminar la cuenta mientras tengas una suscripción paga
              activa o con acceso vigente.
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/55 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="text-lg font-semibold text-zinc-900">
              Confirmar eliminación de cuenta
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Esta acción elimina tu cuenta, empresas, evaluaciones y accesos
              asociados. No se puede deshacer.
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
                onClick={handleDeleteAccount}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingDelete ? "Eliminando..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
