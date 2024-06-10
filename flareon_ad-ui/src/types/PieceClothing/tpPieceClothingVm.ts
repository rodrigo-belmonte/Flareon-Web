import { SelectedProductVm } from "../Products/tpSelectedProductVm";

export type PieceClothingVm
 = {
    id: string;
    description: string;
    name: string;
    products: SelectedProductVm[];
    total: any;
  };
  