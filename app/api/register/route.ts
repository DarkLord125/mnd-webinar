import { NextResponse } from "next/server";
import {
  getDb,
  registrationsCollection,
} from "@/lib/mongo";
import { jsonError } from "@/lib/errors";
import { parseRegisterPayload } from "@/lib/validation";
import type { EventRegistration } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseRegisterPayload(body);
    const eventId = data.eventId || process.env.EVENT_ID || "default";

    const db = await getDb();
    const col = registrationsCollection(db);

    const now = new Date();
    const doc: EventRegistration = {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      eventId,
      age: data.age,
      surveyAnswers: data.surveyAnswers,
      paymentStatus: "pending",
      createdAt: now,
      updatedAt: now,
    };

    try {
      const result = await col.insertOne(doc);
      return NextResponse.json({
        registrationId: result.insertedId.toString(),
        paymentStatus: "pending",
      });
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        const existing = await col.findOne({
          email: doc.email,
          eventId,
        });
        if (existing?._id) {
          return NextResponse.json({
            registrationId: existing._id.toString(),
            paymentStatus: existing.paymentStatus,
          });
        }
      }
      throw err;
    }
  } catch (err) {
    return jsonError(err);
  }
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  );
}
