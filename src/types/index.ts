export interface MenuItem {
  id: string;
  name: string;
  category: string;
  prices: Record<string, number>;
  image: string;
  isVeg: boolean;
  description?: string | null;
}

export interface CartItem extends MenuItem {
  qty: number;
  selectedPortion: string;
}
