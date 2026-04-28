export type TMedicine = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  expiry_date?: string;
  image?: string;
};

export type TMedicineUpdate = Partial<TMedicine> & {
  isActive?: boolean;
};
