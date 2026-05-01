import { MongoClient, type Db } from "mongodb";
import type { EventRegistration, Payment } from "./types";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MongoDB URI in environment variables");
}

if (!process.env.DB_NAME) {
  throw new Error("Missing DB_NAME in environment variables");
}

const uri = process.env.MONGODB_URI;
const options = {};
const dbName = process.env.DB_NAME;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoIndexesReady?: Promise<void>;
};

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalWithMongo._mongoClientPromise;

export default clientPromise;

// Collections
export enum DBCollection {
  EVENT_REGISTRATIONS = "event_registrations",
  PAYMENTS = "payments",
}

async function ensureIndexes(db: Db) {
  if (!globalWithMongo._mongoIndexesReady) {
    globalWithMongo._mongoIndexesReady = (async () => {
      await db
        .collection<EventRegistration>(DBCollection.EVENT_REGISTRATIONS)
        .createIndex({ email: 1, eventId: 1 }, { unique: true });
      await db
        .collection<Payment>(DBCollection.PAYMENTS)
        .createIndex({ orderId: 1 }, { unique: true });
      await db
        .collection<Payment>(DBCollection.PAYMENTS)
        .createIndex({ registrationId: 1 });
    })().catch((err) => {
      globalWithMongo._mongoIndexesReady = undefined;
      throw err;
    });
  }
  return globalWithMongo._mongoIndexesReady;
}

/**
 * Get a connected database instance
 * Use this in all database operations to ensure the client is connected
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  const db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}
