import { CustomerSelectVm } from "../Customer/tpCustomerSelectVm";
import { EmployeeSelectVm } from "../Employee/tpEmployeeSelectVm";
import { PieceClothingVm } from "../PieceClothing/tpPieceClothingVm";


export type Order = {
    id: any;
    orderNumber: any;
    pieces: PieceClothingVm[];
    customer: CustomerSelectVm;
    employee: EmployeeSelectVm;
    production: any;
    totalValue: any;
    dtOrder: string;
    dtWithdrawal: string;
  }; 