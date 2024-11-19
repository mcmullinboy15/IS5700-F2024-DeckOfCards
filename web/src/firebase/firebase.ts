import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User
  } from 'firebase/auth';
  import { auth } from './config';
  
  export class FirebaseAuth {
    //register new user
    static async register(email: string, password: string): Promise<User> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error: any) {
        console.error('Error in registration:', error.message);
        throw error;
      }
    }
  
    //Login existing user
    static async login(email: string, password: string): Promise<User> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error: any) {
        console.error('Error in login:', error.message);
        throw error;
      }
    }
  
    //Logout current user
    static async logout(): Promise<void> {
      try {
        await signOut(auth);
      } catch (error: any) {
        console.error('Error in logout:', error.message);
        throw error;
      }
    }
  
    //Reset password
    static async resetPassword(email: string): Promise<void> {
      try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully");
      } catch (error: any) {
        console.error('Error in password reset:', error.message);
        throw error;
      }
    }
  
    //Get current user
    static getCurrentUser(): User | null {
      return auth.currentUser;
    }
  
    //subscribe to auth state changes
    static onAuthStateChange(callback: (user: User | null) => void): () => void {
      return onAuthStateChanged(auth, callback);
    }
  }