import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// A new screen must wait for the previous camera session to release its stream.
let cameraQueue: Promise<void> = Promise.resolve();

export function useBarcodeCamera(enabled: boolean, onScan: (code: string) => void) {
    useEffect(() => {
        if (!enabled) return;

        let disposed = false;
        let decoded = false;
        let finish: () => void = () => {};
        const finished = new Promise<void>(resolve => { finish = resolve; });

        cameraQueue = cameraQueue.then(async () => {
            if (disposed) return;
            const scanner = new Html5Qrcode('reader');
            let scannedCode: string | undefined;
            try {
                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: 250 },
                    code => {
                        if (disposed || decoded) return;
                        decoded = true;
                        scannedCode = code;
                        finish();
                    },
                    () => {}
                );
                // Cleanup can happen while the permission dialog/start is pending.
                await finished;
            } catch (error) {
                console.error('Unable to start barcode camera:', error);
            } finally {
                try {
                    if (scanner.isScanning) await scanner.stop();
                } finally {
                    scanner.clear();
                }
            }
            if (!disposed && scannedCode !== undefined) onScan(scannedCode);
        }).catch(error => {
            console.error('Unable to release barcode camera:', error);
        });

        return () => {
            disposed = true;
            finish();
        };
    }, [enabled, onScan]);
}
