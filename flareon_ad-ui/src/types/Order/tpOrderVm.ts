import { CustomerSelectVm } from "../Customer/tpCustomerSelectVm";
import { EmployeeSelectVm } from "../Employee/tpEmployeeSelectVm";
import { PieceClothingVm } from "../PieceClothing/tpPieceClothingVm";

export type OrderVm = {
  id: any;
  orderNumber: any;
  pieces: PieceClothingVm[];
  customer: CustomerSelectVm;
  employee: EmployeeSelectVm;
  production: any;
  totalValue: any;
  dtWithdrawal: string;
  dtCompletion: string;
};
