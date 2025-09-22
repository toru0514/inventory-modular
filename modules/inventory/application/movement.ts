export type MovementType =
  | 'purchase_receipt' | 'sales_issue' | 'consume'
  | 'manufact_consume' | 'manufact_output'
  | 'stock_adjust' | 'transfer_in' | 'transfer_out';

export function movementSign(t: MovementType): 1 | -1 | 0 {
  switch (t) {
    case 'purchase_receipt':
    case 'manufact_output':
    case 'transfer_in':
      return 1;
    case 'sales_issue':
    case 'consume':
    case 'manufact_consume':
    case 'transfer_out':
      return -1;
    case 'stock_adjust':
    default:
      return 0; // stock_adjust は amount が正なら +, 負なら - とするため 0
  }
}
