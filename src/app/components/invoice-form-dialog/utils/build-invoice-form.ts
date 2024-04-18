import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice, ItemForm } from '../../../interfaces/invoice.interface';

export const buildInvoiceForm = (
  formBuilder: FormBuilder,
  invoiceFormData: Invoice,
) => {
  return formBuilder.nonNullable.group({
    addressFrom: formBuilder.nonNullable.group({
      street: [invoiceFormData?.billFrom.address.street, [Validators.required]],
      city: [invoiceFormData?.billFrom.address.city, [Validators.required]],
      postCode: [
        invoiceFormData?.billFrom.address.postCode,
        [Validators.required],
      ],
      country: [
        invoiceFormData?.billFrom.address.country,
        [Validators.required],
      ],
    }),
    addressTo: formBuilder.nonNullable.group({
      street: [invoiceFormData?.billTo.address.street, [Validators.required]],
      city: [invoiceFormData?.billTo.address.city, [Validators.required]],
      postCode: [
        invoiceFormData?.billTo.address.postCode,
        [Validators.required],
      ],
      country: [invoiceFormData?.billTo.address.country, [Validators.required]],
    }),
    clientName: [invoiceFormData?.billTo.clientName, [Validators.required]],
    clientEmail: [
      invoiceFormData?.billTo.clientEmail,
      [Validators.required, Validators.email],
    ],
    createdDate: [invoiceFormData?.createdDate.toDate(), [Validators.required]],
    dueDate: [invoiceFormData?.dueDate.toDate(), [Validators.required]],
    projectDescription: [
      invoiceFormData?.projectDescription,
      [Validators.required],
    ],
    itemList: formBuilder.nonNullable.array<FormGroup<ItemForm>>(
      invoiceFormData?.itemList.map((item) =>
        formBuilder.nonNullable.group({
          name: [item.name, [Validators.required]],
          quantity: [
            item.quantity,
            [
              Validators.required,
              Validators.min(1),
              Validators.pattern(/^[0-9]\d*$/),
            ],
          ],
          price: [
            item.price,
            [
              Validators.required,
              Validators.min(0.01),
              Validators.pattern(/^([0-9]*[.])?[0-9]+$/),
            ],
          ],
        }),
      ) ?? [],
      [Validators.required],
    ),
  });
};
