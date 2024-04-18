import { Component, Input } from '@angular/core';
import { INVOICE_STATUS } from '../../interfaces/invoice.interface';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-invoice-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './invoice-status-chip.component.html',
  styleUrl: './invoice-status-chip.component.scss',
})
export class InvoiceStatusChipComponent {
  @Input({ required: true }) status!: INVOICE_STATUS;
  protected readonly INVOICE_STATUS = INVOICE_STATUS;
}
