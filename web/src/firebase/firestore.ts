import { useState, useCallback } from "react";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  WhereFilterOp
} from "firebase/firestore";
import { db } from "./config";

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a document to a collection
  const addDocument = useCallback(
    async (
      collectionName: string,
      data: DocumentData
    ): Promise<string | undefined> => {
      try {
        setLoading(true);
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
      } catch (err) {
        setError(`Error adding document: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get a single document by ID
  const getDocument = useCallback(
    async (
      collectionName: string,
      id: string
    ): Promise<DocumentSnapshot<DocumentData>> => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, id);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
          throw new Error(
            `Document with ID ${id} does not exist in ${collectionName}`
          );
        }
        return docSnapshot;
      } catch (err) {
        setError(`Error getting document: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update a document by ID
  const updateDocument = useCallback(
    async (
      collectionName: string,
      id: string,
      data: Partial<DocumentData>
    ): Promise<void> => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
      } catch (err) {
        setError(`Error updating document: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a document by ID
  const deleteDocument = useCallback(
    async (collectionName: string, id: string): Promise<void> => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (err) {
        setError(`Error deleting document: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get all documents in a collection
  const getCollection = useCallback(
    async (collectionName: string): Promise<QuerySnapshot<DocumentData>> => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot;
      } catch (err) {
        setError(`Error getting collection: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  //query documents with filters
  const queryDocuments = useCallback(
    async (
      collectionName: string,
      fieldPath: string,
      operator: WhereFilterOp,
      value: any
    ): Promise<QuerySnapshot<DocumentData>> => {
      try {
        setLoading(true);
        const q = query(
          collection(db, collectionName),
          where(fieldPath, operator, value)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot;
      } catch (err) {
        setError(`Error querying documents: ${err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getCollection,
    queryDocuments
  };
};