import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  status: string;
  price: number;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "inventory"), orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemList: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<InventoryItem, 'id'>;
        itemList.push({ ...data, id: doc.id } as InventoryItem);
      });
      setInventory(itemList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { inventory, loading };
};
