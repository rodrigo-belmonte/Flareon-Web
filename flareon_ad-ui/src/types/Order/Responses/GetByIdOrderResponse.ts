import { GetByIdOrderVm } from "../tpGetByIdOrderVm";

export type GetByIdOrderResponse ={
    success: boolean;
    message: string;
    validationErrors: string[];
    order: GetByIdOrderVm;
}
