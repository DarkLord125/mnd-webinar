import { google, type sheets_v4 } from "googleapis";
import type { EventRegistration, Payment } from "./types";

let cached: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (cached) return cached;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are not set"
    );
  }

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cached = google.sheets({ version: "v4", auth });
  return cached;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function appendRegistrationRow(
  reg: EventRegistration,
  payment?: Payment | null
): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tab = process.env.GOOGLE_SHEET_TAB || "Registrations";
  if (!sheetId) {
    console.error("[sheets] GOOGLE_SHEET_ID not set, skipping append");
    return;
  }

  const row = [
    reg.name,
    reg.email,
    reg.phone,
    reg.eventId,
    reg.paymentStatus,
    payment?.paymentId || reg.paymentId || "",
    new Date().toISOString(),
  ];

  const delays = [500, 1500, 4500];
  let lastErr: unknown = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const sheets = getSheetsClient();
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${tab}!A:G`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [row] },
      });
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < delays.length) await sleep(delays[attempt]);
    }
  }

  console.error("[sheets] append failed after retries:", {
    email: reg.email,
    eventId: reg.eventId,
    error: lastErr instanceof Error ? lastErr.message : lastErr,
  });
}
