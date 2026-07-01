import { collection, doc, updateDoc, setDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { CreateOrderData, Order } from '@/types';

function ordersRef(restaurantId: string) {
  return collection(db, 'restaurants', restaurantId, 'orders');
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  return `#${timestamp}`;
}

export const ordersService = {
  async create(data: CreateOrderData): Promise<string> {
    const now = new Date().toISOString();
    const ref = doc(ordersRef(data.restaurantId));
    await setDoc(ref, {
      ...data,
      id: ref.id,
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  },

  async updateStatus(restaurantId: string, id: string, statusId: string): Promise<void> {
    await updateDoc(doc(ordersRef(restaurantId), id), {
      statusId,
      updatedAt: new Date().toISOString(),
    });
  },

  async updateNotes(restaurantId: string, id: string, notes: string): Promise<void> {
    await updateDoc(doc(ordersRef(restaurantId), id), {
      notes,
      updatedAt: new Date().toISOString(),
    });
  },
};
