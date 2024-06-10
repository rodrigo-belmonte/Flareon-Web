import { PieceClothingVm } from "../../PieceClothing/tpPieceClothingVm";

export type UpdateOrder = {
    id: any;
    orderNumber: any;
    pieces: PieceClothingVm[];
    customerId: string;
    employeeId: string;
    production: any;
    dtWithdrawal: string;
    dtOrder: string;
}