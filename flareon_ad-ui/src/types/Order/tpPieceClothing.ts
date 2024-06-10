import { SelectedProductVm } from "../Products/tpSelectedProductVm";

export type PieceClothing = {
    id: string;
    name: string;
    description: string;
    products: SelectedProductVm[];
    total: any;
    action: string;
  };