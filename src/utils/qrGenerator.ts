import QRCode from 'qrcode';

export interface UpiPaymentDetails {
  upiId: string;
  recipientName: string;
  amount: number;
  note: string;
  currency?: string;
  transactionRef?: string;
}

/**
 * Builds a standardized NPCI UPI deep link string
 * e.g. upi://pay?pa=name@bank&pn=Receiver&am=500&cu=INR&tn=Emergency+Relief
 */
export function buildUpiPayload(details: UpiPaymentDetails): string {
  const params = new URLSearchParams();
  params.append('pa', details.upiId.trim());
  params.append('pn', details.recipientName.trim());
  if (details.amount > 0) {
    params.append('am', details.amount.toFixed(2));
  }
  params.append('cu', details.currency || 'INR');
  params.append('tn', details.note.trim() || 'Civic Distress Relief Fund');
  if (details.transactionRef) {
    params.append('tr', details.transactionRef);
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Generates high-contrast Data URL for scanning via any phone camera / UPI scanner app
 */
export async function generateQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 360,
      margin: 1.5,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#064e3b', // Deep emerald dark modules
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    // Fallback simple SVG QR representation or standard error
    return '';
  }
}
