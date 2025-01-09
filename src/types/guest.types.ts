export interface IGuest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  bonusBalance: number;
  lastVisitAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
