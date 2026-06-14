import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function readRequiredEnv(name) {
  const value = process.env[name];
  if (!value || value === 'undefined') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function loadServiceAccount() {
  return JSON.parse(readRequiredEnv('FIREBASE_SERVICE_ACCOUNT_KEY'));
}

async function main() {
  const seedArg = process.argv[2];
  if (!seedArg) {
    throw new Error('Usage: npm run firestore:import -- <path-to-seed-json>');
  }

  const seedPath = path.resolve(process.cwd(), seedArg);
  const raw = await fs.readFile(seedPath, 'utf8');
  const seed = JSON.parse(raw);

  if (!getApps().length) {
    initializeApp({ credential: cert(loadServiceAccount()) });
  }

  const db = getFirestore();

  for (const [collectionName, documents] of Object.entries(seed)) {
    if (!Array.isArray(documents)) {
      throw new Error(`Collection '${collectionName}' must be an array.`);
    }

    for (const entry of documents) {
      const { id, ...data } = entry;
      if (id) {
        await db.collection(collectionName).doc(id).set(data, { merge: true });
      } else {
        await db.collection(collectionName).add(data);
      }
    }
  }

  console.log(`Imported Firestore seed from ${seedPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
