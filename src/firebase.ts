import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const onAuthChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
export type { User };

export const saveLead = async (leadData: { name: string; email: string; phone?: string; message?: string }) => {
  try {
    const leadsCollection = collection(db, 'leads');
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
};

export const getLeads = async () => {
  try {
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const deleteLead = async (leadId: string) => {
  try {
    await deleteDoc(doc(db, 'leads', leadId));
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};
