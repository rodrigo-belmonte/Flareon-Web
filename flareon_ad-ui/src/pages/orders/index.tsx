/* eslint-disable react/jsx-key */
import {
  Component,
  PureComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";

import { api } from "../../services/api";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import withAuth from "../../components/PrivateRoute/withAuth";
import { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColDef } from "ag-grid-community";
import ReactToPrint from "react-to-print";
import { render, Printer, Text } from "react-thermal-printer";
import { GetAlOrderResponse } from "../../types/Order/Responses/GetAllOrderResponse";

type RowSelected = {
  id: string | string[];
  customerName: string;
  employeeName: string;
  totalValue: string;
  dtOrder: string;
  orderNumber: number;
  action: string;
};

type rowOrderData = {
  id: any;
  orderNumber: any;
  customerName: string;
  employeeName: string;
  totalValue: any;
  dtOrder: string;
  dtWithdrawal: string;
  dtCompletion: string;
  open: boolean;
};

function ListOrders() {
  const [rowData, setRowData] = useState<rowOrderData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "orderNumber", headerName: "Nº", width: 90, sortable: true, sort: "desc" },
    { field: "customerName", headerName: "Cliente", flex: 1, sortable: true },
    {
      field: "employeeName",
      headerName: "Funcionário",
      flex: 1,
      sortable: true,
    },
    {
      field: "totalValue",
      headerName: "Valor",
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
      width: 150,
    },
    {
      field: "dtOrder",
      headerName: "Data Comanda",
      width: 200,
      sortable: true,
    },
    {
      field: "dtCompletion",
      headerName: "Data Finalização",
      width: 200,
      sortable: true,
    },
    {
      field: "dtWithdrawal",
      headerName: "Data Retirada",
      width: 200,
      sortable: true,
    },
    {
      field: "options",
      headerName: "",
      cellRendererFramework: (params) => {
        const row = params.data;
        return (
          <div>
            {row.open === true ? (
              <>
                <a>
                  <Link href={`orders/edit/${row.id}`}>
                    <EditIcon />
                  </Link>
                </a>
                <a onClick={() => handleClickOpen(row)}>
                  <DeleteIcon />
                </a>
              </>
            ) : (
              <>
                <a>
                  <Link href={`orders/readOnly/${row.id}`}>
                    <Visibility />
                  </Link>
                </a>
              </>
            )}
          </div>
        );
      },
      floatingFilter: false,
      width: 120,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowSelected, setRowSelected] = useState<RowSelected>({
    id: "",
    customerName: "",
    employeeName: "",
    totalValue: "",
    dtOrder: "",
    orderNumber: 0,
    action: "",
  });

  const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setOpenSnackbarError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbarSuccess(false);
    setOpenSnackbarError(false);
  };
  //End SnackBar

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    api
      .get("/order")
      .then((response) => {
        const getAllOrderResponse: GetAlOrderResponse = response.data;
        console.log(getAllOrderResponse);
        if (getAllOrderResponse.success) {
          const orderList = getAllOrderResponse.orderList.map((order) => {
            return {
              id: order.id,
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              employeeName: order.employeeName,
              totalValue: order.totalValue,
              dtOrder: format(parseISO(order.dtOrder), "dd/MM/yyyy", {
                locale: ptBR,
              }),
              dtWithdrawal: format(parseISO(order.dtWithdrawal), "dd/MM/yyyy",{
                locale: ptBR,
              }),
              dtCompletion: format(parseISO(order.dtCompletion), "dd/MM/yyyy", {
                locale: ptBR,
              }),
              open: Boolean(order.open),
            };
          });
          console.log(orderList);
          setRowData(orderList);
        } else {
          setErrorMessage("Erro ao Carregar Lista:");
          setErrors(response.data.validationErrors);
          setOpenSnackbarError(true);
        }
      })
      .catch((error: AxiosError) => {
        setErrorMessage("Erro ao Carregar Lista:");
        setErrors([error.message]);
        setOpenSnackbarError(true);
      });
  }, []);

  const handleClickOpen = (row: RowSelected) => {
    setOpenDialog(true);
    setRowSelected(row);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleDelete = () => {
    api
      .delete(`/order/${rowSelected.id}`)
      .then((response) => {
        if (response.data.success) {
          setOpenSnackbarSuccess(true);
          setOpenDialog(false);
        } else {
          setErrorMessage("Erro ao Excluir");
          setErrors(response.data.validationErrors);
          setOpenSnackbarError(true);
        }
      })
      .catch((error) => {
        setErrorMessage("Erro ao Excluir");
        setErrors([error]);
        setOpenSnackbarError(true);
      })
      .finally(() => {
        api
          .get("/order")
          .then((response) => {
            const getAllOrderResponse: GetAlOrderResponse = response.data;
            if (getAllOrderResponse.success) {
              const orderList = getAllOrderResponse.orderList.map((order) => {
                return {
                  id: order.id,
                  orderNumber: order.orderNumber,
                  customerName: order.customerName,
                  employeeName: order.employeeName,
                  totalValue: order.totalValue,
                  dtOrder: format(parseISO(order.dtOrder), "dd/MM/yyyy", {
                    locale: ptBR,
                  }),
                  dtWithdrawal: format(parseISO(order.dtWithdrawal), "dd/MM/yyyy", {
                    locale: ptBR,
                  }),
                  dtCompletion: format(parseISO(order.dtCompletion), "dd/MM/yyyy", {
                    locale: ptBR,
                  }),
                  open: Boolean(order.open),
                };
              });
              setRowData(orderList);
            } else {
              setErrorMessage("Erro ao Carregar Lista:");
              setErrors(response.data.validationErrors);
              setOpenSnackbarError(true);
            }
          })
          .catch((error) => {
            setErrorMessage("Erro ao Carregar Lista:");
            setErrors([error]);
            setOpenSnackbarError(true);
          });
      });
  };

  return (
    <div className="box list">
      <h1>Comandas</h1>
      <Grid container>
        <Grid item xs={12}>
          <Link href={"orders/new"} className="newButton">
            <Button variant="contained">Nova Comanda</Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <div
            className="ag-theme-alpine"
            style={{ height: "80vh", width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                resizable: true,
                filter: "agTextColumnFilter",
                floatingFilter: true,
              }}
            ></AgGridReact>
          </div>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"ATENÇÃO"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja Excluir a comanda #{rowSelected.orderNumber}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Não
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbarSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Excluído com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbarError}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          <strong>{errorMessage}</strong> <br />
          {errors}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withAuth(ListOrders);
