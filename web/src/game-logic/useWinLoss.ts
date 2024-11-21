import { useFirestore } from "../firebase/db";
import { useCallback } from "react";
import { auth } from "../firebase/config";

export const useWinLoss = () => {
  const { addDocument, getDocument, updateDocument } = useFirestore();

  const getWinLoss = useCallback(async (): Promise<{
    wins: number;
    losses: number;
  }> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not logged in");
    }

    const userId = user.uid;
    try {
      const docSnapshot = await getDocument("winLoss", userId);
      const data = docSnapshot.data();
      return {
        wins: data?.wins || 0,
        losses: data?.losses || 0,
      };
    } catch (err) {
      // If no record exists, initialize it with 0 wins and losses
      if (err instanceof Error && err.message.includes("does not exist")) {
        await addDocument("winLoss", { wins: 0, losses: 0, userId });
        return { wins: 0, losses: 0 };
      }
      throw err;
    }
  }, [getDocument, addDocument]);

  const addWin = useCallback(async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not logged in");
    }

    const userId = user.uid;
    try {
      const { wins } = await getWinLoss();
      await updateDocument("winLoss", userId, { wins: wins + 1 });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to add win: ${err.message}`);
      }
      throw err; // Re-throw if err is not of type Error
    }
  }, [getWinLoss, updateDocument]);

  const addLoss = useCallback(async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not logged in");
    }

    const userId = user.uid;
    try {
      const { losses } = await getWinLoss();
      await updateDocument("winLoss", userId, { losses: losses + 1 });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to add loss: ${err.message}`);
      }
      throw err; // Re-throw if err is not of type Error
    }
  }, [getWinLoss, updateDocument]);

  return {
    getWinLoss,
    addWin,
    addLoss,
  };
};
