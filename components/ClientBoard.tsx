"use client";

import { useEffect, useState } from "react";

type Client = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

type ClientBoardProps = {
  initialClients: Client[];
};

type DraftClient = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const emptyDraft: DraftClient = {
  name: "",
  phone: "",
  email: "",
  notes: ""
};

export function ClientBoard({ initialClients }: ClientBoardProps) {
  const [clients, setClients] = useState(initialClients);
  const [draft, setDraft] = useState<DraftClient>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createClient() {
    if (!draft.name) {
      setError("Name is required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });
      if (!response.ok) {
        throw new Error("Failed to create client");
      }
      const created: Client = await response.json();
      setClients((prev) => [...prev, created]);
      setDraft(emptyDraft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateClient(id: number, payload: Partial<DraftClient>) {
    const response = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("Failed to update client");
    }
    const updated: Client = await response.json();
    setClients((prev) => prev.map((client) => (client.id === id ? updated : client)));
  }

  async function deleteClient(id: number) {
    const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete client");
    }
    setClients((prev) => prev.filter((client) => client.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add client</h2>
        <div className="space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">Name</span>
              <input
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">Phone</span>
              <input
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.phone}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">Email</span>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.email}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-gray-600">Notes</span>
              <textarea
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.notes}
                rows={3}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>
          </div>
          <button
            className="w-full rounded-lg bg-primary px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={createClient}
          >
            {isSubmitting ? "Saving..." : "Save client"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Client list</h2>
        <ul className="space-y-3">
          {clients.length === 0 && (
            <li className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm">
              No clients yet.
            </li>
          )}
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={deleteClient}
              onUpdate={updateClient}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

type ClientCardProps = {
  client: Client;
  onUpdate: (id: number, payload: Partial<DraftClient>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

function ClientCard({ client, onUpdate, onDelete }: ClientCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftClient>({
    name: client.name,
    phone: client.phone ?? "",
    email: client.email ?? "",
    notes: client.notes ?? ""
  });

  useEffect(() => {
    if (!isEditing) {
      setDraft({
        name: client.name,
        phone: client.phone ?? "",
        email: client.email ?? "",
        notes: client.notes ?? ""
      });
    }
  }, [client, isEditing]);

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{client.name}</p>
          <span className="text-xs uppercase text-gray-400">Client</span>
        </div>
        {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
        {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
        {client.notes && <p className="text-sm text-gray-500">{client.notes}</p>}
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3 text-sm">
          {localError && <p className="text-sm text-red-600">{localError}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-gray-600">Name</span>
              <input
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <label>
              <span className="mb-1 block text-gray-600">Phone</span>
              <input
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.phone}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label>
              <span className="mb-1 block text-gray-600">Email</span>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-200 p-2"
                value={draft.email}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-gray-600">Notes</span>
              <textarea
                className="w-full rounded-lg border border-gray-200 p-2"
                rows={3}
                value={draft.notes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-white"
              onClick={async () => {
                if (!draft.name) {
                  setLocalError("Name is required.");
                  return;
                }
                try {
                  setLocalError(null);
                  await onUpdate(client.id, draft);
                  setIsEditing(false);
                } catch (err) {
                  setLocalError(err instanceof Error ? err.message : "Failed to update");
                }
              }}
            >
              Save changes
            </button>
            <button
              className="rounded-lg border border-gray-200 px-4 py-2"
              onClick={() => {
                setDraft({
                  name: client.name,
                  phone: client.phone ?? "",
                  email: client.email ?? "",
                  notes: client.notes ?? ""
                });
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              className="ml-auto rounded-lg border border-red-200 px-4 py-2 text-red-600"
              onClick={async () => {
                try {
                  await onDelete(client.id);
                } catch (err) {
                  setLocalError(err instanceof Error ? err.message : "Failed to delete");
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </li>
  );
}
