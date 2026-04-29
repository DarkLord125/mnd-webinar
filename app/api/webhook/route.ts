import { NextResponse } from "next/server";
import {
  getDb,
  paymentsCollection,
  registrationsCollection,
} from "@/lib/mongo";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { appendRegistrationRow } from "@/lib/sheets";

export const runtime = "nodejs";

type WebhookEvent = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        notes?: Record<string, string>;
      };
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  let valid: boolean;
  try {
    valid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error("[webhook] signature check threw:", err);
    return NextResponse.json({ error: "Bad config" }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let body: WebhookEvent;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  const entity = body.payload?.payment?.entity;
  const orderId = entity?.order_id;
  const paymentId = entity?.id;

  if (!orderId || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = await getDb();
    const payCol = paymentsCollection(db);
    const regCol = registrationsCollection(db);
    const now = new Date();

    if (event === "payment.captured") {
      const payRes = await payCol.findOneAndUpdate(
        { orderId, status: { $ne: "success" } },
        {
          $set: {
            status: "success",
            paymentId,
            updatedAt: now,
          },
        },
        { returnDocument: "after" }
      );

      const payment =
        payRes ?? (await payCol.findOne({ orderId }));
      if (payment?.registrationId) {
        await regCol.updateOne(
          {
            _id: payment.registrationId,
            paymentStatus: { $ne: "success" },
          },
          {
            $set: {
              paymentStatus: "success",
              paymentId,
              updatedAt: now,
            },
          }
        );
        const reg = await regCol.findOne({ _id: payment.registrationId });
        if (reg) {
          void appendRegistrationRow(reg, {
            ...payment,
            paymentId,
            status: "success",
          });
        }
      }
    } else if (event === "payment.failed") {
      const payment = await payCol.findOneAndUpdate(
        { orderId, status: { $ne: "success" } },
        { $set: { status: "failed", paymentId, updatedAt: now } },
        { returnDocument: "after" }
      );
      if (payment?.registrationId) {
        await regCol.updateOne(
          {
            _id: payment.registrationId,
            paymentStatus: { $ne: "success" },
          },
          { $set: { paymentStatus: "failed", updatedAt: now } }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook] handler error:", err);
    // Return 200 if signature was valid; logging is enough.
    // Razorpay will retry on non-2xx, but db errors are usually transient
    // and we don't want to amplify load. Choose 500 to trigger a retry.
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
