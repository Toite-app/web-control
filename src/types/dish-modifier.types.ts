export interface IDishModifier {
  id: string;
  name: string;
  restaurantId: string;
  isActive: boolean;
  isRemoved: boolean;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
