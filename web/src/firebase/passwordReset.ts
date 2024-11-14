import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();

export default function sendPasswordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log("check your inbox for the password reset email!")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("password reset did not work. here is the error: ", errorCode, errorMessage);
        throw error;
    });
};


