import React, { useState, useEffect } from "react";
import {
  Server,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Cpu,
  ClipboardPaste,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  getApiBaseUrl,
  setCustomApiUrl,
  clearCustomApiUrl,
  checkBackendHealth,
  STORAGE_KEY_API_URL,
} from "../services/apiService";
import { toast } from "sonner";

interface ServerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: (apiUrl: string) => void;
}

export default function ServerConnectionModal({
  isOpen,
  onClose,
  onConnected,
}: ServerConnectionModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
    gpuInfo?: string;
  }>({ type: "idle", message: "" });

  const activeUrl = getApiBaseUrl();
  const isCustomUrl =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem(STORAGE_KEY_API_URL));

  useEffect(() => {
    if (isOpen) {
      const current = localStorage.getItem(STORAGE_KEY_API_URL) || activeUrl || "";
      setUrlInput(current.replace(/\/api\/?$/, ""));
      setStatus({ type: "idle", message: "" });
    }
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleTestAndConnect = async () => {
    const raw = urlInput.trim();
    if (!raw) {
      toast.error("Please enter a valid URL or Cloudflare Tunnel link.");
      return;
    }

    setIsTesting(true);
    setStatus({ type: "idle", message: "Connecting to server..." });

    try {
      const result = await checkBackendHealth(raw);

      if (result.ok) {
        const savedUrl = setCustomApiUrl(raw);
        setStatus({
          type: "success",
          message: "Successfully connected to Better Me AI backend!",
          gpuInfo: result.gpu ? `GPU: ${result.gpu} (CUDA Active)` : "Backend Online",
        });
        toast.success("Backend connected successfully!");
        if (onConnected) {
          onConnected(savedUrl);
        }
      } else {
        setStatus({
          type: "error",
          message:
            result.error ||
            "Could not reach server. Verify that python run_kaggle.py is running and tunnel is active.",
        });
        toast.error("Connection failed. Check URL & Kaggle status.");
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || "Failed to reach backend endpoint.",
      });
      toast.error("Connection failed.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetDefault = () => {
    clearCustomApiUrl();
    setUrlInput("");
    setStatus({
      type: "idle",
      message: "Reset to default environment URL.",
    });
    toast.info("Reset to default backend configuration.");
    if (onConnected) {
      onConnected(getApiBaseUrl());
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setUrlInput(text.trim().replace(/\/api\/?$/, ""));
          toast.info("Pasted from clipboard!");
        }
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#182a4d] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Connect AI Backend (Kaggle GPU)
              </h2>
              <p className="text-xs text-slate-500 font-['Inter']">
                Connect live Kaggle Cloudflare Tunnel to power real-time AI therapy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Active Status Banner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Current Active Endpoint:
              </span>
              <span className="text-xs font-mono font-medium text-slate-800 truncate block">
                {activeUrl}
              </span>
            </div>
            {isCustomUrl ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                Custom URL
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 flex-shrink-0">
                Default
              </span>
            )}
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Kaggle Cloudflare Tunnel URL
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] font-semibold text-[#2a5fb7] hover:underline flex items-center gap-1"
              >
                <ClipboardPaste className="w-3 h-3" />
                Paste URL
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xxxx-xxxx.trycloudflare.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2a5fb7] font-mono text-xs text-slate-900 bg-slate-50/50"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-['Inter']">
              Copy the <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">🔗 PUBLIC URL</code> printed in your Kaggle notebook after running <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">python run_kaggle.py</code>.
            </p>
          </div>

          {/* Status Message Display */}
          {status.type === "success" && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{status.message}</p>
                {status.gpuInfo && (
                  <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                    {status.gpuInfo}
                  </p>
                )}
              </div>
            </div>
          )}

          {status.type === "error" && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Connection Failed</p>
                <p className="text-[11px] text-red-700 mt-0.5">{status.message}</p>
              </div>
            </div>
          )}

          {/* Quick Guide / Instructions */}
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80 space-y-1.5 text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              How it works:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 font-['Inter']">
              <li>Open your Kaggle GPU Notebook and run <code className="font-mono text-slate-800 bg-white/80 px-1 rounded">!python run_kaggle.py</code></li>
              <li>Wait for Cloudflare Tunnel to print <code className="font-mono text-slate-800 bg-white/80 px-1 rounded">🔗 PUBLIC URL : https://...trycloudflare.com</code></li>
              <li>Paste that URL here and click <strong>Test & Connect</strong>. Live chat will connect instantly without needing to redeploy Vercel!</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {isCustomUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetDefault}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleTestAndConnect}
              disabled={isTesting || !urlInput.trim()}
              className="bg-[#2a5fb7] hover:bg-[#1f478a] text-white text-xs font-semibold px-4 flex items-center gap-1.5"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5" />
                  Test & Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
