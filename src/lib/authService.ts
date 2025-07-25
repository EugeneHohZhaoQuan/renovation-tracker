// lib/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth, db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

// User type definition
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Registration data type
export interface RegistrationData {
  email: string;
  password: string;
  displayName: string;
}

// Login data type
export interface LoginData {
  email: string;
  password: string;
}

// Convert Firebase User to our User type
export const formatUser = (user: FirebaseUser): User => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

// Register a new user
export const registerUser = async (data: RegistrationData): Promise<User> => {
  try {
    // Create the user in Firebase Authentication
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    // Update the user profile with display name
    await updateProfile(userCredential.user, {
      displayName: data.displayName,
    });

    // Create a user document in Firestore
    const userDoc = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: data.displayName,
      photoURL: userCredential.user.photoURL,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    return formatUser(userCredential.user);
  } catch (error) {
    console.error('Error registering user:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to register user';
    throw new Error(errorMessage);
  }
};

// Sign in an existing user
export const signIn = async (data: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    return formatUser(userCredential.user);
  } catch (error) {
    console.error('Error signing in:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to sign in';
    throw new Error(errorMessage);
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    // Clear the session cookie
    document.cookie =
      'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Sign out from Firebase
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to sign out';
    throw new Error(errorMessage);
  }
};

// Get the current user
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  return user ? formatUser(user) : null;
};

// User data interface
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp | null;
  [key: string]: string | null | Timestamp | undefined;
}

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as DocumentData;
      return {
        uid: data.uid || uid,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.photoURL || null,
        createdAt: data.createdAt || null,
      };
    } else {
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to get user data';
    throw new Error(errorMessage);
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      try {
        // Get the ID token with force refresh to ensure it's up to date
        const idToken = await user.getIdToken(true);

        // Set the session cookie (in a real app, this would be done by the server)
        // This is a client-side simulation for demonstration purposes
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const expirationDate = new Date(Date.now() + expiresIn);
        document.cookie = `session=${idToken}; expires=${expirationDate.toUTCString()}; path=/`;
      } catch (error) {
        console.error('Error setting session cookie:', error);
      }
    }

    callback(user ? formatUser(user) : null);
  });
};
