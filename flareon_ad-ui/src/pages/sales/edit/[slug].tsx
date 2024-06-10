import * as React from "react";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Alert,
  Snackbar,
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  AlertColor,
} from "@mui/material";
import { api } from "../../../services/api";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import withAuth from "../../../components/PrivateRoute/withAuth";
import Link from "next/link";
import NumberFormat from "react-number-format";
import { AxiosError } from "axios";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import OrderComponent from "../components/orderComponent";
import { OrderSale } from "../../../types/Sale/tpOrderSale";

type Sale = {
  Id: string;
  OrderId: string;
  PaymentType: string;
  Installments: string;
  TotalValue: Number;
};

type Order = {
  Id: string;
  Products: ProductList[];
  EmployeeName: string;
  CustomerName: string;
  DtOrder: string;
  TotalValue: Number;
  OrderNumber: Number;
};

type ProductList = {
  id: string;
  name: string;
  price: number;
  obs: string;
  quantity: number;
  total: number;
};

function EditSale() {
  const router = useRouter();
  const id = router.query.slug;
  const [orderValues, setOrderValues] = useState<OrderSale>({
    Id: "",
    EmployeeName: "",
    CustomerName: "",
    DtOrder: "",
    Pieces: [],
    TotalValue: 0,
    OrderNumber: 0,
    DtWithdrawal: "",
    DtCompletion: ""
  });
  const [saleValues, setSaleValues] = useState({
    Id: "",
    OrderId: "",
    PaymentType: "",
    Installments: "",
    TotalValue: orderValues.TotalValue,
  });
  const [hiddenInstallments, setHiddenInstallments] = useState<boolean>(false);

  //SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "name", headerName: "Nome", width: 250 },
    {
      field: "price",
      headerName: "Preço",
      width: 100,
    },
    {
      field: "quantity",
      headerName: "Quantidade",
      width: 120,
    },
    {
      field: "obs",
      headerName: "Observação",
      width: 200,
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },
  ]);
  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  const paymentTypes = [
    { key: 0, name: "Crédito" },
    { key: 1, name: "Débito" },
    { key: 2, name: "Dinheiro" },
  ];
  const installments = [
    { key: 1, name: "1" },
    { key: 2, name: "2" },
    { key: 3, name: "3" },
    { key: 4, name: "4" },
    { key: 5, name: "5" },
    { key: 6, name: "6" },
    { key: 7, name: "7" },
    { key: 8, name: "8" },
    { key: 9, name: "9" },
    { key: 10, name: "10" },
    { key: 11, name: "11" },
    { key: 12, name: "12" },
  ];

  useEffect(() => {
    async function fetchData() {
      await api
        .get(`/sale/${id}`)
        .then((response) => {
          if (response.data.success == true) {
            console.log(response.data);
            const sale = response.data.sale;
            const resOrder = sale.order;
            setSaleValues({
              Id: sale.id,
              OrderId: resOrder.id,
              Installments: sale.installments,
              PaymentType: sale.paymentType,
              TotalValue: sale.totalValue,
            });

            setHiddenInstallments(
              sale.paymentType !== "Crédito" ? true : false
            );

           setOrderValues({
              Id: resOrder.Id,
              OrderNumber: resOrder.orderNumber,
              EmployeeName: resOrder.employee.name,
              CustomerName: resOrder.customer.name,
              DtOrder: format(parseISO(resOrder.dtOrder), "dd/MM/yyyy", {
                locale: ptBR,
              }),
              Pieces: resOrder.pieces,
              TotalValue: resOrder.totalValue,
              DtWithdrawal: resOrder.dtWithdrawal,
              DtCompletion: resOrder.dtCompletion
            });
          } else {
            setSeveritySnackbar("error");
            setSnackBarTitle("Erro ao Carregar:");
            const errors: string[] = response.data.validationErrors;
            setSnackBarMessage(errors.join(" - "));
            setOpenSnackbar(true);
          }
        })
        .catch((error: AxiosError) => {
          setSeveritySnackbar("error");
          setSnackBarTitle("Erro ao Carregar:");
          setSnackBarMessage(error.message);
          setOpenSnackbar(true);
        });
    }

    fetchData();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSaleValues({
      ...saleValues,
      [event.target.name]: event.target.value,
    });
    if (event.target.name == "PaymentType") {
      setHiddenInstallments(event.target.value !== "Crédito" ? true : false);
    }
  };

  const Put = () => {
    if (Validator()) {
      const installments =
        saleValues.PaymentType === "Crédito" ? saleValues.Installments : 1;
      const sale = {
        id: saleValues.Id,
        paymentType: saleValues.PaymentType,
        installments: installments.toString(),
      };
      api
        .put(`/sale`, sale)
        .then((response) => {
          if (response.data.success == true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);
            router.push("/sales");
          } else {
            setSeveritySnackbar("error");
            setSnackBarTitle("Erro ao Salvar:");
            const errors: string[] = response.data.validationErrors;
            setSnackBarMessage(errors.join(" - "));
            setOpenSnackbar(true);
          }
        })
        .catch((error: AxiosError) => {
          setSeveritySnackbar("error");
          setSnackBarTitle("Erro ao Salvar:");
          setSnackBarMessage(error.message);
          setOpenSnackbar(true);
        });
    }
  };

  const Validator = () => {
    //Campos obrigatórios
    if (saleValues.PaymentType == "") {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Favor preencher os campos obrigatórios.");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };
  return (
    <div className={"box new-edit"}>
      <h1>Editar Venda</h1>
      <div>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <OrderComponent _order={orderValues} />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={"formBox"}>
              <Grid container sx={{ p: 2 }}>
                <Grid item>
                  <FormControl
                    sx={{ m: 2, width: 300 }}
                    variant="standard"
                    required
                    error={saleValues.PaymentType == ""}
                  >
                    <InputLabel htmlFor="PaymentType">
                      Tipo de Pagamento
                    </InputLabel>
                    <Select
                      labelId="PaymentType"
                      id="PaymentType"
                      name="PaymentType"
                      value={saleValues.PaymentType}
                      label="PaymentType"
                      onChange={handleChange}
                    >
                      {paymentTypes.map((type) => (
                        <MenuItem key={type.key} value={type.name}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {hiddenInstallments === false ? (
                    <FormControl
                      sx={{ m: 2, width: 100, display: {} }}
                      variant="standard"
                    >
                      <InputLabel htmlFor="Installments">Parcelas</InputLabel>
                      <Select
                        labelId="Installments"
                        id="Installments"
                        name="Installments"
                        value={saleValues.Installments}
                        label="Installments"
                        onChange={handleChange}
                      >
                        {installments.map((installment) => (
                          <MenuItem
                            key={installment.key}
                            value={installment.name}
                          >
                            {installment.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : null}
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Put}>
              SALVAR
            </Button>
            <Link href="/sales">
              <Button variant="contained" color="error">
                CANCELAR
              </Button>
            </Link>
          </div>
        </Grid>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severitySnackbar}>
          <strong>{snackBarTitle}</strong> <br />
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withAuth(EditSale);
