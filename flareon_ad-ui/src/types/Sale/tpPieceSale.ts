import { SelectedProductVm } from "../Products/tpSelectedProductVm";

export type PieceSale = {
  id: string;
  name: string;
  description: string;
  products: SelectedProductVm[];
  total: number;
};
