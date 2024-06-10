import { PieceSale } from "./tpPieceSale";

export type OrderSale = {
    Id: string;
    Pieces: PieceSale[];
    EmployeeName: string;
    CustomerName: string;
    DtOrder: string;
    DtWithdrawal: string;
    DtCompletion: string;
    TotalValue: Number;
    OrderNumber: Number;
  };
  