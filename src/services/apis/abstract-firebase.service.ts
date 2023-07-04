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
  getDocs, QuerySnapshot, DocumentData, query as _query, where,
} from 'firebase/firestore';
import { firebaseDatabase } from 'boot/iv-api';
import {WhereFirestore} from "src/common/dtos";
import {WorkDone} from "src/common/utils";
import {displayNotification} from "src/services/common/notification.service";
import {NotificationStatusEnum} from "src/common/enums";

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

  protected async getAll(): Promise<T[]> {
    const collectionRef = this.getCollectionRef();
    const querySnapshot = await getDocs(collectionRef);
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      const docWithId = { ...doc.data(), id: doc.id }
      data.push(docWithId as T);
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

  /**
   * Permet de faire une requête sur firebase (sur la table user uniquement) avec un seul champ dans le where
   * @param whereData {WhereFirestore}
   */
  protected async _queryByField(
    whereData: WhereFirestore
  ): Promise<QuerySnapshot<T>> {
    const collectionRef = this.getCollectionRef();
    const query = _query(collectionRef, where(whereData.field, whereData.operator, whereData.value));
    return await getDocs<T>(query);
  }

  /**
   * Permet de faire une requête sur firebase (sur la table user uniquement) avec un plusieurs champs dans le where
   * @param whereData {WhereFirestore[]}
   * @private
   */
  protected async _queryByFields(
    whereData: WhereFirestore[]
  ): Promise<QuerySnapshot<T>> {
    const collectionRef = this.getCollectionRef();
    const conditions = whereData.map((whereClause) => {
      return where(whereClause.field, whereClause.operator, whereClause.value);
    });
    const composedQuery = _query(collectionRef, ...conditions);

    return await getDocs<T>(composedQuery);
  }

  protected _catchHandler<T>(wd: WorkDone<T>): WorkDone<T> | Promise<WorkDone<T>> {
    let message = wd.error?.message ?? 'Unknown Error (2)'
    if (wd.error) {
      message = wd.error.message as string
    }
    displayNotification(NotificationStatusEnum.FAILURE, message)
    return WorkDone.buildError<T>(message)
  }

  protected _thenHandler<T>(wd: WorkDone<T>): WorkDone<T> | Promise<WorkDone<T>> {
    // Check if the response isOK
    if ( wd.isOk && wd.data) {
      if (wd.successMessage) {
        displayNotification(NotificationStatusEnum.SUCCESS, wd.successMessage)
      }
      if (wd.warningMessage) {
        displayNotification(NotificationStatusEnum.WARNING, wd.warningMessage)
      }
      return wd

    } else if (wd.data && wd.error) {
      // In case of functional error, display an error message
      let message: string = wd.error.message || 'Unknown Error'
      const logRef = wd.error.logRef
      if (logRef) {
        message = message.concat(` - logRef: ${logRef}`)
      }

      displayNotification(NotificationStatusEnum.FAILURE, message)
      return WorkDone.buildError<T>(message)
    } else {
      return WorkDone.buildError<T>('Unknown Error (1)')
    }
  }

}
