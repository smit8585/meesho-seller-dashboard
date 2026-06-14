"use client";

import { useState } from "react";

function UploadCard({
  title,
  description,
  endpoint,
  accept,
}: {
  title: string;
  description: string;
  endpoint: string;
  accept: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <input
        type="file"
        accept={accept}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {result && (
        <div className="mt-3 text-sm bg-gray-50 border rounded p-3">
          {Object.entries(result).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium">{k}:</span> {String(v)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload Files</h1>
      <UploadCard
        title="Upload Manifest (PDF)"
        description="Upload the manifest you generate when dispatching orders. Each order will be added to your tracker with status 'Dispatched'."
        endpoint="/api/manifest"
        accept="application/pdf"
      />
      <UploadCard
        title="Upload Payment Statement (Excel)"
        description="Upload Meesho's payment statement excel. Orders matching by Sub Order No will have their status and settlement amount updated."
        endpoint="/api/payment"
        accept=".xlsx,.xls"
      />
    </div>
  );
}
