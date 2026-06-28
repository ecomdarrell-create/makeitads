"use client";

import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/test-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData: {
            name: "Mon Entreprise Test",
            industry: "dental",
            country: "France",
            targetAudience: "Familles"
          }
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">🧪 Page de Test API</h1>
      
      <button
        onClick={handleTest}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 font-bold"
      >
        {loading ? "En cours..." : "Lancer le Test"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-900/50 border border-green-500 rounded text-green-200 overflow-auto max-h-96">
          <p className="mb-2 font-bold">✅ Succès ! Source : {result.source}</p>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(result.strategy, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}