import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InvoiceTileComponent } from '../invoice-tile/invoice-tile.component';
import { MatRippleModule } from '@angular/material/core';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { AsyncPipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    MatListModule,
    InvoiceTileComponent,
    MatRippleModule,
    AsyncPipe,
    FlexLayoutModule,
    RouterLink,
  ],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss',
})
export class InvoicesListComponent {
  constructor(protected invoiceService: InvoiceService) {}
}
