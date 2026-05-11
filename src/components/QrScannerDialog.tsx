import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Html5Qrcode } from "html5-qrcode";
import { useTranslation } from "react-i18next";

interface QrScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

const QrScannerDialog = ({ open, onClose, onScan }: QrScannerDialogProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const scannerId = "qr-reader";
    let mounted = true;
    handledRef.current = false;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (!mounted || handledRef.current) return;
            handledRef.current = true;
            // Stop scanner BEFORE handing off, so the camera/decoder
            // doesn't fire again and we don't leave the stream open.
            try {
              await scanner.stop();
            } catch {}
            onScan(decodedText);
          },
          () => {}
        );
      } catch (err) {
        if (mounted) setError("Could not access camera. Please allow camera permissions.");
      }
    };

    // Small delay to let the DOM render the container
    const timeout = setTimeout(startScanner, 300);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s) {
        // Only call stop() if the scanner is actually running, otherwise
        // html5-qrcode throws and the camera light can stay on.
        try {
          // @ts-ignore - getState exists at runtime
          const state = s.getState?.();
          if (state === 2 /* SCANNING */ || state === 3 /* PAUSED */) {
            s.stop().catch(() => {});
          }
        } catch {}
      }
    };
  }, [open, onScan, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("qrScanner.title", "Scan QR Code")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden" style={{ minHeight: 300 }} />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <p className="text-xs text-muted-foreground text-center">
            {t("qrScanner.hint", "Point your camera at a QR code to scan it")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrScannerDialog;
