export class Record {
  id?: string;
  casinoId: string = '';
  userId: string = '';
  recordTypeId: string = '';

  casino: string = '';
  type: string = '';
  deposit: number = 0;
  withdrawal: number = 0;
  total: number = 0;
  date: string = '';
  notes: string = '';
  createdAt: string = '';
  deletedAt: string = '';
}