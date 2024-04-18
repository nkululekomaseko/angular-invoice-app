import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { Invoice, INVOICE_STATUS } from '../../interfaces/invoice.interface';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { v4 as uuid } from 'uuid';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Timestamp } from 'firebase/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { buildInvoiceForm } from './utils/build-invoice-form';

enum InvoiceStatus {
  PENDING,
  SAVING,
  SUCCESS,
  ERROR,
}

@Component({
  selector: 'app-invoice-form-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    NgForOf,
    MatProgressSpinner,
    CurrencyPipe,
  ],
  templateUrl: '../invoice-form-dialog/invoice-form-dialog.component.html',
  styleUrl: '../invoice-form-dialog/invoice-form-dialog.component.scss',
})
export class InvoiceFormDialogComponent {
  constructor(
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private dialogRef: MatDialogRef<InvoiceFormDialogComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private invoiceFormData: Invoice,
  ) {}

  invoiceStatus = InvoiceStatus.PENDING;

  invoiceForm = buildInvoiceForm(this.formBuilder, this.invoiceFormData);

  addItem() {
    this.invoiceForm.controls.itemList.push(
      this.formBuilder.nonNullable.group({
        name: ['', [Validators.required]],
        quantity: [
          0,
          [
            Validators.required,
            Validators.min(1),
            Validators.pattern(/^[0-9]\d*$/),
          ],
        ],
        price: [
          0,
          [
            Validators.required,
            Validators.min(0.01),
            Validators.pattern(/^([0-9]*[.])?[0-9]+$/),
          ],
        ],
      }),
    );
  }

  removeItem(index: number) {
    this.invoiceForm.controls.itemList.removeAt(index);
  }

  async submitForm() {
    if (this.invoiceForm.invalid) {
      return;
    }

    const {
      addressFrom,
      addressTo,
      clientName,
      clientEmail,
      createdDate,
      dueDate,
      projectDescription,
      itemList,
    } = this.invoiceForm.getRawValue();

    const invoiceToSave: Invoice = {
      reference: this.invoiceFormData?.reference ?? uuid(),
      billFrom: {
        address: {
          ...addressFrom,
        },
      },
      billTo: {
        address: {
          ...addressTo,
        },
        clientName,
        clientEmail,
      },
      createdDate: Timestamp.fromDate(createdDate),
      dueDate: Timestamp.fromDate(dueDate),
      projectDescription,
      status: this.invoiceFormData?.status ?? INVOICE_STATUS.DRAFT,
      itemList,
    };

    this.invoiceStatus = InvoiceStatus.SAVING;

    let isInvoiceSaved: boolean;

    if (this.invoiceFormData) {
      isInvoiceSaved = await this.invoiceService.updateInvoice(invoiceToSave);
    } else {
      isInvoiceSaved = await this.invoiceService.createInvoice(invoiceToSave);
    }

    if (isInvoiceSaved) {
      this.invoiceStatus = InvoiceStatus.SUCCESS;
      this.snackbar.open('Invoice saved successfully', 'Okay', {
        duration: 3000,
      });
      this.dialogRef.close();
    } else {
      this.invoiceStatus = InvoiceStatus.ERROR;
    }
  }

  protected readonly InvoiceStatus = InvoiceStatus;
}
