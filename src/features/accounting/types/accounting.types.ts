export type DatePreset = 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  start: string; // ISO string
  end: string;   // ISO string
}

export interface AccountingStats {
  totalRevenue: number;
  orderCount: number;
  avgTicket: number;
  byPaymentMethod: Record<string, number>;
}
