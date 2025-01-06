export interface IRestaurant {
  id: string;
  name: string;
  legalEntity: string;
  address: string;
  latitude: number;
  longitude: number;
  isEnabled: boolean;
  isClosedForever: boolean;
  createdAt: string;
  updatedAt: string;
}
