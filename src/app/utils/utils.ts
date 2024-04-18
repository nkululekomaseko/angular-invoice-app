import { Item } from '../interfaces/invoice.interface';

export const calculateTotalAmountDue = (items: Array<Item>): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
