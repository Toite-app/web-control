export interface IDishesMenu {
  id: string;
  name: string;
  restaurants: {
    id: string;
    name: string;
  }[];
  ownerId: string;
  owner: {
    id: string;
    name: string;
  };
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
}
