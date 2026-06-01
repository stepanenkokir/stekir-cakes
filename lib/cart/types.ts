export type CartItem = {
  id: string;
  slug: string;
  name: string;
  weightLbs: number;
  tiers: number;
  inscription: string;
  decorationNotes: string;
  deliveryDate: string;
  unitPrice: number;
  quantity: number;
};

export type AddCartItemInput = Omit<CartItem, "id" | "quantity">;
