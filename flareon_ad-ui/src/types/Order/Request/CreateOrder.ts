import { PieceClothingVm } from "../../PieceClothing/tpPieceClothingVm";

export type CreateOrder = { 
    pieces: PieceClothingVm[];
    customerId: string;
    employeeId: string;
    production: any;
    dtWithdrawal: string;
}