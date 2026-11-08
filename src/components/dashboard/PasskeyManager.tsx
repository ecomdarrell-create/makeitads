'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Fingerprint,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  isPlatformAuthenticatorAvailable,
  getPasskeyLabel,
  type PasskeyLabel,
} from '@/lib/passkey/detect';
import {
  listPasskeys,
  registerPasskey,
  renamePasskey,
  deletePasskey,
  isPasskeyApiAvailable,
  type PasskeyRecord,
} from '@/lib/passkey/client';
import { getPasskeyErrorMessage } from '@/lib/passkey/errors';

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function PasskeyManager() {
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [supported, setSupported] = useState(false);
  const [label, setLabel] = useState<PasskeyLabel>({ label: 'la biométrie', icon: 'fingerprint' });
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const apiOk = isPasskeyApiAvailable(supabase);
      setApiAvailable(apiOk);
      if (!apiOk) {
        setLoading(false);
        return;
      }
      const [ok, list] = await Promise.all([
        isPlatformAuthenticatorAvailable(),
        listPasskeys(supabase),
      ]);
      setSupported(ok);
      setLabel(getPasskeyLabel());
      setPasskeys(list);
    } catch (err) {
      setError(getPasskeyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async () => {
    setAdding(true);
    setError('');
    setInfo('');
    try {
      const supabase = createClient();
      await registerPasskey(supabase);
      setInfo('Passkey ajoutée avec succès.');
      await load();
    } catch (err) {
      setError(getPasskeyErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const handleStartRename = (p: PasskeyRecord) => {
    setEditingId(p.id);
    setEditingName(p.friendly_name || '');
    setError('');
    setInfo('');
  };

  const handleSaveRename = async (passkeyId: string) => {
    const name = editingName.trim();
    if (!name) {
      setError('Le nom ne peut pas être vide.');
      return;
    }
    setBusyId(passkeyId);
    setError('');
    try {
      const supabase = createClient();
      await renamePasskey(supabase, passkeyId, name);
      setEditingId(null);
      setEditingName('');
      setInfo('Passkey renommée.');
      await load();
    } catch (err) {
      setError(getPasskeyErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async (passkeyId: string) => {
    setBusyId(passkeyId);
    setError('');
    try {
      const supabase = createClient();
      await deletePasskey(supabase, passkeyId);
      setConfirmDeleteId(null);
      setInfo('Passkey supprimée.');
      await load();
    } catch (err) {
      setError(getPasskeyErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
          <Fingerprint className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-relaxed text-slate-600 sm:text-sm">
            Connectez-vous sans mot de passe grâce à la biométrie de vos appareils
            ({label.label}, empreinte digitale, Windows Hello…). Vos données
            biométriques restent sur votre appareil.
          </p>

          {loading && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Chargement des passkeys…
            </div>
          )}

          {!loading && !apiAvailable && (
            <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800 sm:text-xs">
              La connexion biométrique n&apos;est pas disponible sur cette version.
            </div>
          )}

          {!loading && apiAvailable && !supported && (
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600 sm:text-xs">
              Cet appareil ne dispose pas d&apos;un capteur biométrique compatible.
              La connexion par mot de passe reste disponible.
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-1.5 rounded border border-red-200 bg-red-50 p-2 text-[11px] text-red-700 sm:text-xs">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mt-3 flex items-start gap-1.5 rounded border border-emerald-200 bg-emerald-50 p-2 text-[11px] text-emerald-700 sm:text-xs">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{info}</span>
            </div>
          )}

          {!loading && apiAvailable && supported && (
            <>
              {passkeys.length === 0 ? (
                <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                  Aucune passkey enregistrée pour le moment.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {passkeys.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 sm:p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {editingId === p.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              autoFocus
                              maxLength={60}
                              className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[12px] outline-none focus:border-indigo-500 sm:text-xs"
                              placeholder="Nom de l'appareil"
                            />
                          ) : (
                            <p className="truncate text-[12px] font-semibold text-slate-900 sm:text-sm">
                              {p.friendly_name || 'Passkey sans nom'}
                            </p>
                          )}
                          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
                            Ajoutée le {formatDate(p.created_at)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          {editingId === p.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveRename(p.id)}
                                disabled={busyId === p.id}
                                aria-label="Enregistrer le nom"
                                className="rounded-full p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                              >
                                {busyId === p.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                aria-label="Annuler le renommage"
                                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartRename(p)}
                                aria-label="Renommer"
                                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(p.id)}
                                aria-label="Supprimer"
                                className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {confirmDeleteId === p.id && (
                        <div className="mt-2 rounded border border-rose-200 bg-rose-50 p-2">
                          <p className="text-[11px] text-rose-800">
                            Supprimer cette passkey ? Vous ne pourrez plus l&apos;utiliser
                            pour vous connecter.
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmDelete(p.id)}
                              disabled={busyId === p.id}
                              className="rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {busyId === p.id ? 'Suppression…' : 'Supprimer'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={handleAdd}
                disabled={adding}
                className="mt-3 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 sm:min-h-10 sm:px-4 sm:text-xs"
              >
                {adding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                {adding ? 'Enregistrement…' : 'Ajouter une passkey'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}