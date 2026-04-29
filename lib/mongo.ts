import { MongoClient, type Db } from "mongodb";
import type { EventRegistration, Payment } from "./types";

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
  var __mongoIndexesReady: Promise<void> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mongoClientPromise = client.connect();
  }
  return global.__mongoClientPromise;
}

async function ensureIndexes(db: Db) {
  if (!global.__mongoIndexesReady) {
    global.__mongoIndexesReady = (async () => {
      await db
        .collection<EventRegistration>("event_registrations")
        .createIndex({ email: 1, eventId: 1 }, { unique: true });
      await db
        .collection<Payment>("payments")
        .createIndex({ orderId: 1 }, { unique: true });
      await db
        .collection<Payment>("payments")
        .createIndex({ registrationId: 1 });
    })().catch((err) => {
      global.__mongoIndexesReady = undefined;
      throw err;
    });
  }
  return global.__mongoIndexesReady;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const dbName = process.env.MONGODB_DB || "mnd_webinar";
  const db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}

export function registrationsCollection(db: Db) {
  return db.collection<EventRegistration>("event_registrations");
}

export function paymentsCollection(db: Db) {
  return db.collection<Payment>("payments");
}
