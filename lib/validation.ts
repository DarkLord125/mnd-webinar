import { ApiError } from "./errors";
import type { RegisterPayload, SurveyAnswers } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

export function parseRegisterPayload(body: unknown): RegisterPayload {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Invalid request body");
  }
  const b = body as Record<string, unknown>;

  const name = asString(b.name);
  const email = asString(b.email);
  const phone = asString(b.phone);
  const age = asString(b.age);
  const eventId = asString(b.eventId);

  if (!name) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "Invalid email");
  if (!phone) throw new ApiError(400, "Phone is required");
  if (!age) throw new ApiError(400, "Age is required");

  const sa = (b.surveyAnswers ?? {}) as Record<string, unknown>;
  const surveyAnswers: SurveyAnswers = {
    q1: asStringArray(sa.q1),
    q2: asStringArray(sa.q2),
    q3: asStringArray(sa.q3),
    q4: asStringArray(sa.q4),
    q5: asStringArray(sa.q5),
  };

  return {
    name,
    email,
    phone,
    eventId: eventId || undefined,
    age,
    surveyAnswers,
  };
}

export function parseCreateOrderPayload(body: unknown): {
  registrationId: string;
  amount?: number;
  currency?: string;
} {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Invalid request body");
  }
  const b = body as Record<string, unknown>;
  const registrationId = asString(b.registrationId);
  if (!registrationId) {
    throw new ApiError(400, "registrationId is required");
  }
  const amount = typeof b.amount === "number" ? b.amount : undefined;
  const currency =
    typeof b.currency === "string" ? b.currency.trim() : undefined;
  return { registrationId, amount, currency };
}

export function parseVerifyPayload(body: unknown): {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
} {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Invalid request body");
  }
  const b = body as Record<string, unknown>;
  const razorpay_order_id = asString(b.razorpay_order_id);
  const razorpay_payment_id = asString(b.razorpay_payment_id);
  const razorpay_signature = asString(b.razorpay_signature);
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing Razorpay verification fields");
  }
  return { razorpay_order_id, razorpay_payment_id, razorpay_signature };
}
