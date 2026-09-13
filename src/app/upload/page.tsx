"use client";

import { useState } from "react";
import Link from "next/link";

function UploadCard({
  title,
  description,
  endpoint,
  accept,
  icon,
  successMessage,
}: {
  title: string;
  description: string;
  endpoint: string;
  accept: string;
  icon: string;
  successMessage: (data: Record<string, unknown>) => string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

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
        setError(data.error ?? "Upload failed. Please try again.");
      } else {
        setResult(data);
        setFile(null);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h2 className="font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) setFile(dropped);
          }}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : file
              ? "border-green-400 bg-green-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); setError(null); }}
          />
          {file ? (
            <>
              <span className="text-2xl mb-1">✅</span>
              <span className="text-sm font-medium text-green-700">{file.name}</span>
              <span className="text-xs text-green-600 mt-0.5">Ready to upload</span>
            </>
          ) : (
            <>
              <span className="text-2xl mb-1">📂</span>
              <span className="text-sm text-gray-500">Drag & drop or click to select</span>
              <span className="text-xs text-gray-400 mt-0.5">{accept.replace(/\./g, "").toUpperCase()}</span>
            </>
          )}
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
        >
          {loading ? "Processing..." : "Upload & Process"}
        </button>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            ⚠️ {error}
          </div>
        )}
        {result && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
            ✅ {successMessage(result)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Files</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload manifests daily as you dispatch, and payment statements when Meesho releases them.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <UploadCard
          title="Manifest PDF"
          description="Upload today's dispatch manifest from Meesho Supplier Panel. Orders will be added with status Dispatched."
          endpoint="/api/manifest"
          accept=".pdf"
          icon="📋"
          successMessage={(d) =>
            `${d.created} order(s) added${Number(d.skipped) > 0 ? `, ${d.skipped} already tracked (skipped)` : ""}.`
          }
        />
        <UploadCard
          title="Payment Statement Excel"
          description="Upload Meesho's payment statement. Order statuses and settlement amounts will be updated automatically."
          endpoint="/api/payment"
          accept=".xlsx,.xls"
          icon="💰"
          successMessage={(d) =>
            `${d.updated} order(s) updated${Number(d.notFound) > 0 ? ` (${d.notFound} not in your tracker yet)` : ""}.`
          }
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">📅 Recommended workflow</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Every morning you dispatch — upload the manifest PDF from Meesho</li>
          <li>When Meesho releases a payment statement — upload the Excel file</li>
          <li>Check your <Link href="/" className="underline">dashboard</Link> for a full picture of your orders and earnings</li>
        </ol>
      </div>
    </div>
  );
}
