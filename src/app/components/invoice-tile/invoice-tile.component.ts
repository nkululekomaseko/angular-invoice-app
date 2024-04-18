import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { Invoice, INVOICE_STATUS } from '../../interfaces/invoice.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPrefix } from '@angular/material/form-field';
import { calculateTotalAmountDue } from '../../utils/utils';
import { InvoiceStatusChipComponent } from '../invoice-status-chip/invoice-status-chip.component';

@Component({
  selector: 'app-invoice-tile',
  standalone: true,
  imports: [
    MatGridListModule,
    MatChipsModule,
    MatCardModule,
    CommonModule,
    FlexLayoutModule,
    MatRippleModule,
    MatIconModule,
    MatPrefix,
    NgOptimizedImage,
    InvoiceStatusChipComponent,
  ],
  templateUrl: './invoice-tile.component.html',
  styleUrl: './invoice-tile.component.scss',
})
export class InvoiceTileComponent {
  @Input({ required: true }) invoice: Invoice | undefined;
  protected readonly calculateTotal = calculateTotalAmountDue;
  protected readonly INVOICE_STATUS = INVOICE_STATUS;
}
