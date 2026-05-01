import type { ObjectId } from "mongodb";

export type PaymentStatus = "pending" | "success" | "failed";
export type PaymentRecordStatus = "created" | "success" | "failed";

export type SurveyAnswers = {
  q1: string[];
  q2: string[];
  q3: string[];
  q4: string[];
  q5: string[];
};

export type EventRegistration = {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  eventId: string;
  age: string;
  surveyAnswers: SurveyAnswers;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  _id?: ObjectId;
  registrationId: ObjectId;
  orderId: string;
  amount: number;
  currency: string;
  email: string;
  eventId: string;
  status: PaymentRecordStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  eventId?: string;
  age: string;
  surveyAnswers: SurveyAnswers;
};
