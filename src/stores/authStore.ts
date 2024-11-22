import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, isAuthenticated: !!user });
  });

  return {
    user: null,
    isAuthenticated: false,
    signIn: async (email, password) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isAuthenticated: true });
    },
    signUp: async (email, password, name) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      set({ user: userCredential.user, isAuthenticated: true });
    },
    signOut: async () => {
      await firebaseSignOut(auth);
      set({ user: null, isAuthenticated: false });
    },
    setUser: (user) => set({ user, isAuthenticated: !!user }),
  };
});