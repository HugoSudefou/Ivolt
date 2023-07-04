import { onUnmounted } from 'vue';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  DocumentReference,
  UpdateData,
  WithFieldValue,
  CollectionReference,
  getDocs,
} from 'firebase/firestore';
import { firebaseDatabase } from 'boot/iv-api';

export abstract class AbstractFirebaseService<T> {
  protected abstract collectionPath: string;

  protected getCollectionRef(): CollectionReference<T> {
    return collection(
      firebaseDatabase,
      this.collectionPath,
    ) as CollectionReference<T>;
  }

  protected getDocumentRef(id: string) {
    return doc(firebaseDatabase, `${this.collectionPath}/${id}`);
  }

  protected async get(id: string): Promise<T | null> {
    const docRef = this.getDocumentRef(id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      return null;
    }
  }

  protected async getWithReference(id: string, referenceField: string): Promise<T | null> {
    console.log('referenceField : ', referenceField)
    const docRef = this.getDocumentRef(id);
    console.log('docRef : ', docRef)
    const docSnap = await getDoc(docRef);
    console.log('docSnap : ', docSnap)

    if (docSnap.exists()) {
      const data = docSnap.data() as T;
      console.log('data : ', data)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log('data[referenceField] : ', data[referenceField])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const referencedDocRef = doc(data[referenceField]) as DocumentReference;
      console.log('referencedDocRef : ', referencedDocRef)
      const referencedDocSnap = await getDoc(referencedDocRef);
      console.log('referencedDocSnap : ', referencedDocSnap)

      if (referencedDocSnap.exists()) {
        const referencedData = referencedDocSnap.data();
        console.log('referencedData : ', referencedData)
        // Merge referenced data into the original document data
        return { ...data, [referenceField]: referencedData };
      }
    }

    return null;
  }

  protected async getAll(): Promise<T[]> {
    const collectionRef = this.getCollectionRef();
    const querySnapshot = await getDocs(collectionRef);
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data() as T);
    });
    return data;
  }
  protected async add(data: WithFieldValue<T>): Promise<string> {
    const collectionRef = this.getCollectionRef();
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  protected async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = this.getDocumentRef(id);
    await updateDoc(
      docRef as DocumentReference<T>,
      { ...data } as UpdateData<T>,
    );
  }

  protected async remove(id: string): Promise<void> {
    const docRef = this.getDocumentRef(id);
    await deleteDoc(docRef);
  }

  protected onSnapshot(callback: (data: T[]) => void): () => void {
    const collectionRef = this.getCollectionRef();
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as T);
      callback(data);
    });
    onUnmounted(unsubscribe);
    return unsubscribe;
  }

  private async getReferencedData(reference: DocumentReference): Promise<any | null> {
    const referencedDocSnap = await getDoc(reference);

    if (referencedDocSnap.exists()) {
      return referencedDocSnap.data();
    }

    return null;
  }

  protected async mergeReferencedData(data: T, referencedDataField: string): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (data[referencedDataField] instanceof DocumentReference) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const referencedDocRef = data[referencedDataField] as DocumentReference;
      const referencedData = await this.getReferencedData(referencedDocRef);

      if (referencedData) {
        return { ...data, [referencedDataField]: referencedData } as T;
      }
    }

    return data;
  }
}
