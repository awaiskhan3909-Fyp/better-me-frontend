import React, { useState, useEffect } from "react";
import { Server, Cpu, AlertCircle, CheckCircle2 } from "lucide-react";
import { checkBackendHealth, getApiBaseUrl, STORAGE_KEY_API_URL } from "../services/apiService";
import ServerConnectionModal from "./ServerConnectionModal";

interface ServerStatusIndicatorProps {
  className?: string;
  variant?: "pill" | "badge" | "minimal";
  onStatusChange?: (isHealthy: boolean) => void;
}

export default function ServerStatusIndicator({
  className = "",
  variant = "pill",
  onStatusChange,
}: ServerStatusIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [gpuName, setGpuName] = useState<string | null>(null);

  const activeUrl = getApiBaseUrl();
  const isCustomUrl =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem(STORAGE_KEY_API_URL));

  const checkStatus = async () => {
    try {
      const res = await checkBackendHealth();
      setIsOnline(res.ok);
      setGpuName(res.gpu || null);
      if (onStatusChange) {
        onStatusChange(res.ok);
      }
    } catch {
      setIsOnline(false);
      if (onStatusChange) {
        onStatusChange(false);
      }
    }
  };

  useEffect(() => {
    checkStatus();
    // Periodically re-check every 60s
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [activeUrl]);

  const handleConnected = () => {
    checkStatus();
  };

  if (variant === "minimal") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
            isOnline
              ? "text-emerald-700 hover:text-emerald-800"
              : "text-amber-700 hover:text-amber-800"
          } ${className}`}
          title="Click to configure backend connection"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>{isOnline ? (gpuName ? "Kaggle GPU Online" : "AI Online") : "Connect Server"}</span>
        </button>

        <ServerConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnected={handleConnected}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
          isOnline === true
            ? "bg-emerald-50/80 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70"
            : isOnline === false
            ? "bg-amber-50/90 text-amber-800 border-amber-300 hover:bg-amber-100"
            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
        } ${className}`}
        title="Click to check or change backend URL (Kaggle Cloudflare Tunnel)"
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isOnline === true
              ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
              : isOnline === false
              ? "bg-amber-500 animate-pulse"
              : "bg-slate-400"
          }`}
        />
        <span className="font-semibold text-[11px]">
          {isOnline === true
            ? isCustomUrl
              ? gpuName ? "Kaggle GPU" : "Kaggle AI"
              : "AI Server"
            : isOnline === false
            ? "Connect Kaggle GPU"
            : "Checking..."}
        </span>
      </button>

      <ServerConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnected={handleConnected}
      />
    </>
  );
}
