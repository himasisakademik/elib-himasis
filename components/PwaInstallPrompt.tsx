"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptOutcome = {
  readonly outcome: "accepted" | "dismissed";
  readonly platform: string;
};

type InstallPromptEvent = Event & {
  readonly userChoice: Promise<InstallPromptOutcome>;
  prompt: () => Promise<void>;
};

function isInstallPromptEvent(event: Event): event is InstallPromptEvent {
  return "prompt" in event && typeof event.prompt === "function" && "userChoice" in event;
}

function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "unknown registration error";
        console.warn(`PWA service worker registration failed: ${message}`);
      });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      if (!isInstallPromptEvent(event)) {
        return;
      }

      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    setIsInstalled(isStandaloneDisplay());
    setIsIos(isIosDevice());
    setIsReady(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
  };

  if (!isReady || isInstalled) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      aria-labelledby="pwa-install-title"
      className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-blue-400/15 p-2 text-blue-200" aria-hidden="true">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h3 id="pwa-install-title" className="text-sm font-semibold text-white sm:text-base">
              Akses E-Lib lebih cepat
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              {isIos
                ? "Buka menu Bagikan di browser, lalu pilih Tambahkan ke Layar Utama."
                : deferredPrompt
                  ? "Pasang E-Lib di perangkat ini untuk membukanya seperti aplikasi."
                  : "Buka menu browser dan pilih Install atau Tambahkan ke Layar Utama jika tersedia."}
            </p>
          </div>
        </div>

        {deferredPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="min-h-11 shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
          >
            Install E-Lib
          </button>
        )}
      </div>
    </section>
  );
}
