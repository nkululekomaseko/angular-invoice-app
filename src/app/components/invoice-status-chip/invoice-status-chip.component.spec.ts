import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatusChipComponent } from './invoice-status-chip.component';

describe('InvoiceStatusChipComponent', () => {
  let component: InvoiceStatusChipComponent;
  let fixture: ComponentFixture<InvoiceStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceStatusChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
