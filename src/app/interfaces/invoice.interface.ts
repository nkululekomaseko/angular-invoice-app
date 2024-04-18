import { FormControl } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

export enum INVOICE_STATUS {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface Invoice {
  reference: string;
  billFrom: {
    address: Address;
  };
  billTo: {
    clientName: string;
    clientEmail: string;
    address: Address;
  };
  createdDate: Timestamp;
  dueDate: Timestamp;
  projectDescription: string;
  status: INVOICE_STATUS;
  itemList: Array<Item>;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
}

export interface ItemForm {
  name: FormControl<string>;
  quantity: FormControl<number>;
  price: FormControl<number>;
}
