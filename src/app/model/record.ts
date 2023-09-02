export class Record {
  record_id?: string;
  casino_id?: string;
  user_id?: string;
  record_type_id?: string;

  casino: string = '';
  type: string = '';
  deposit: number = 0;
  withdrawal: number = 0;
  total: number = 0;
  date: string = '';
  note: string = '';
  created_at: string = '';
}