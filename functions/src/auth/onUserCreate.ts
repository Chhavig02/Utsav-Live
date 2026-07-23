import * as functions from 'firebase-functions';

import { admin, db } from '../admin';

const SL_ID_PREFIX = 'SL';
const SL_ID_DIGITS = 8;
const MAX_GENERATION_ATTEMPTS = 10;

class SlIdCollisionError extends Error {
  constructor() {
    super('SL_ID_COLLISION');
  }
}

function randomSlId(): string {
  const max = 10 ** SL_ID_DIGITS;
  const n = Math.floor(Math.random() * max);
  return `${SL_ID_PREFIX}${n.toString().padStart(SL_ID_DIGITS, '0')}`;
}

/**
 * Fires once, automatically, when a new Firebase Auth account is created. Firebase Auth
 * resolves an existing phone number to the same account on repeat sign-ins, so this never
 * runs twice for one phone number.
 *
 * Creates the user's profile and wallet documents atomically with a server-generated,
 * collision-checked SL-ID. These fields are never writable from the client.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const candidate = randomSlId();

    try {
      await db.runTransaction(async (tx) => {
        const existing = await tx.get(db.collection('users').where('sl_id', '==', candidate));
        if (!existing.empty) {
          throw new SlIdCollisionError();
        }

        tx.set(db.collection('users').doc(user.uid), {
          sl_id: candidate,
          name: '',
          phone: user.phoneNumber ?? '',
          avatar_url: null,
          cover_url: null,
          role: 'viewer',
          followers_count: 0,
          following_count: 0,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        tx.set(db.collection('wallets').doc(user.uid), {
          user_id: user.uid,
          coins_balance: 0,
          lifetime_gift_coins_received: 0,
          lifetime_withdrawn: 0,
        });
      });

      return;
    } catch (error) {
      if (error instanceof SlIdCollisionError) {
        continue; // retry with a new candidate
      }
      functions.logger.error('onUserCreate failed', { uid: user.uid, error });
      throw error;
    }
  }

  functions.logger.error('onUserCreate: exhausted sl_id generation attempts', { uid: user.uid });
  throw new Error('Could not generate a unique SL-ID after multiple attempts');
});
