import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormDialogComponent } from './invoice-form-dialog.component';

describe('InvoiceFormDialogComponent', () => {
  let component: InvoiceFormDialogComponent;
  let fixture: ComponentFixture<InvoiceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
