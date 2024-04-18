import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { InvoicesListComponent } from '../invoices-list/invoices-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceFormDialogComponent } from '../invoice-form-dialog/invoice-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatLabel } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltip,
    MatDivider,
    InvoicesListComponent,
    MatDialogModule,
    InvoiceFormDialogComponent,
    FlexLayoutModule,
    AsyncPipe,
    MatLabel,
    MatProgressSpinner,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    public invoiceFormDialog: MatDialog,
    protected invoiceService: InvoiceService,
    protected authService: AuthService,
  ) {}

  openInvoiceFormDialog() {
    this.invoiceFormDialog.open(InvoiceFormDialogComponent, {
      minHeight: 200,
      maxWidth: 650,
    });
  }

  evaluateInvoiceNumberLabel(count: number): String {
    return (
      {
        0: 'There are no invoices',
        1: "There's 1 invoice",
      }[count] ?? `There are ${count} invoices`
    );
  }
}
