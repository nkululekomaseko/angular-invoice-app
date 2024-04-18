import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Invoice, INVOICE_STATUS } from '../../interfaces/invoice.interface';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe, DatePipe, Location } from '@angular/common';
import { calculateTotalAmountDue } from '../../utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InvoiceStatusChipComponent } from '../invoice-status-chip/invoice-status-chip.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CONFIRM_DIALOG_RESULT,
  ConfirmDialogComponent,
} from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { InvoiceFormDialogComponent } from '../invoice-form-dialog/invoice-form-dialog.component';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    FlexLayoutModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    MatProgressSpinner,
    InvoiceStatusChipComponent,
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent implements OnInit {
  @Input() invoiceId!: string;

  invoiceState$: Observable<Invoice | null> | undefined;
  protected loadingData = false;

  constructor(
    private invoiceService: InvoiceService,
    private snackbar: MatSnackBar,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.invoiceState$ = this.invoiceService.getInvoiceById(this.invoiceId);
  }

  goToPreviousPage() {
    return this.location.back();
  }

  async updateInvoiceStatus(updatedInvoice: Invoice, status: INVOICE_STATUS) {
    this.loadingData = true;
    const isInvoiceUpdated = await this.invoiceService.updateInvoice({
      ...updatedInvoice,
      status,
    });

    if (isInvoiceUpdated) {
      this.snackbar.open(`Invoice marked as ${status}`, 'Okay', {
        duration: 5000,
      });
    } else {
      this.snackbar.open('Unable to update invoice', 'Okay', {
        duration: 5000,
      });
    }

    this.loadingData = false;
  }

  async editInvoice(invoice: Invoice) {
    this.dialog.open(InvoiceFormDialogComponent, {
      minHeight: 200,
      maxWidth: 650,
      data: invoice,
    });
  }

  async deleteInvoice(invoiceId: string) {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Warning!',
        message: 'Are you sure you want to DELETE this invoice?',
      },
    });

    confirmDialogRef
      .afterClosed()
      .subscribe(async (result: CONFIRM_DIALOG_RESULT) => {
        if (result === CONFIRM_DIALOG_RESULT.CONFIRM) {
          this.loadingData = true;
          const isInvoiceDeleted =
            await this.invoiceService.deleteInvoice(invoiceId);

          if (isInvoiceDeleted) {
            this.snackbar.open(
              `Invoice has been deleted successfully!`,
              'Okay',
              {
                duration: 5000,
              },
            );
            await this.router.navigate(['home']);
          } else {
            this.snackbar.open('Unable to delete invoice', 'Okay', {
              duration: 5000,
            });
          }
        }
      });
    this.loadingData = false;
  }
  protected readonly calculateTotal = calculateTotalAmountDue;
  protected readonly INVOICE_STATUS = INVOICE_STATUS;
}
