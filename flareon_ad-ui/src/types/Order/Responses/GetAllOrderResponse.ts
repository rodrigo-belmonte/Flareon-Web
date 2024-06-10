import { GetAllOrderListVm } from "../tpGetAllOrderListVm";

export type GetAlOrderResponse ={ 
    success: boolean;
    message: string;
    validationErrors: string[];
    orderList: GetAllOrderListVm[];
}
