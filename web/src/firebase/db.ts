import { useState, useCallback } from "react";
import { db } from "./config";

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    loading,
    error,
  };
};
