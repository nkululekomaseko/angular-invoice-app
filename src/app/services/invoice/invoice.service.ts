import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { AuthService } from '../auth/auth.service';
import { Invoice } from '../../interfaces/invoice.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private INVOICE_COLLECTION = 'invoices';

  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  public invoiceState$ = this.getInvoices();

  constructor() {
    this.authService.authState$.subscribe((user) => {
      if (user) {
        this.invoiceState$ = this.getInvoices();
      }
    });
  }

  private getInvoices(): Observable<Array<Invoice & { userId: string }>> {
    const user = this.authService.userSubject.getValue();
    const invoiceCollection = query(
      collection(this.firestore, this.INVOICE_COLLECTION),
      where('userId', '==', user?.uid),
      orderBy('createdDate'),
      limit(10),
    );

    return collectionData(invoiceCollection, {
      idField: 'id',
    }) as Observable<Array<Invoice & { userId: string }>>;
  }

  getInvoiceById(invoiceId: string): Observable<Invoice | null> {
    return this.invoiceState$.pipe(
      map((invoices) => {
        const firstInvoice = invoices.filter(
          (invoice) => invoice.reference === invoiceId,
        )[0];
        if (!firstInvoice) {
          return null;
        }
        const { userId, ...invoiceData } = firstInvoice;
        return invoiceData;
      }),
    );
  }

  async createInvoice(invoice: Invoice): Promise<boolean> {
    const user = this.authService.userSubject.getValue();
    if (user) {
      const newInvoiceData = {
        userId: user.uid,
        ...invoice,
      };

      const invoiceCollection = collection(
        this.firestore,
        this.INVOICE_COLLECTION,
      );
      return addDoc(invoiceCollection, newInvoiceData)
        .then(() => true)
        .catch((error) => {
          console.error(`Unable to save invoice: ${error}`);
          return false;
        });
    }
    return false;
  }

  async updateInvoice(invoice: Invoice): Promise<boolean> {
    const invoiceCollection = query(
      collection(this.firestore, this.INVOICE_COLLECTION),
      where('reference', '==', invoice.reference),
      limit(1),
    );

    const querySnapshot = await getDocs(invoiceCollection);
    const docRef = querySnapshot.docs[0];

    if (docRef) {
      return updateDoc(docRef.ref, { ...invoice })
        .then(() => true)
        .catch((error) => {
          console.error(`Error occured while updating doc: ${error}`);
          return false;
        });
    }

    return false;
  }

  async deleteInvoice(invoiceId: String): Promise<boolean> {
    const invoiceCollection = query(
      collection(this.firestore, this.INVOICE_COLLECTION),
      where('reference', '==', invoiceId),
      limit(1),
    );

    const querySnapshot = await getDocs(invoiceCollection);
    const docRef = querySnapshot.docs[0];

    if (docRef) {
      return deleteDoc(docRef.ref)
        .then(() => true)
        .catch((error) => {
          console.error(`Error occured while updating doc: ${error}`);
          return false;
        });
    }
    return false;
  }
}
