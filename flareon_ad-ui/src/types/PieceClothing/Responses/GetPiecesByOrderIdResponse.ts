import { PieceClothingVm } from "../tpPieceClothingVm";

export type GetPiecesByOrderIdResponse ={
    success: boolean;
    message: string;
    validationErrors: string[];
    pieces: PieceClothingVm[];
}