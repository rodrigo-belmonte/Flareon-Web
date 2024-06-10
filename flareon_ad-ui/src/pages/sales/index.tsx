import { useCallback, useEffect, useRef, useState } from "react";

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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { api } from "../../services/api";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import withAuth from "../../components/PrivateRoute/withAuth";
import { AxiosError } from "axios";

import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { ColDef } from "ag-grid-community";

function ListSales() {
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "orderNumber", headerName: "Nº. Comanda", width:150, sortable: true },
    { field: "customerName", headerName: "Cliente", flex: 1, sortable: true },
    { field: "employeeName", headerName: "Funcionário", flex: 1, sortable: true },
    {
      field: "paymentType",
      headerName: "Tipo de Pagamento",
      width: 200,
      floatingFilter: false,
    },
    {
      field: "totalValue",
      headerName: "Valor Total",
      width: 200,
      floatingFilter: false,
      valueFormatter: (params) =>
      "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },
    { field: "dtSale", headerName: "Data Venda", width: 200, sortable: true },
    {
      field: "options",
      headerName: "",
      cellRenderer: (params) => {
        const rowSelected = params.data;
        return (
          <div>
            <Link href={`sales/edit/${rowSelected.id}`}>
              <a>
                <EditIcon />
              </a>
            </Link>
            {/* <a onClick={() => handleClickOpen(rowSelected)}>
              <DeleteIcon />
            </a> */}
          </div>
        );
      },
      floatingFilter: false,
      width: 120,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowSelected, setRowSelected] = useState({
    id: 0,
    customerName: "",
    paymentType: "",
    totalValue: "",
    dtSale: "",
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
      .get("/sale")
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.saleList)
          const saleList = response.data.saleList.map((sale) => {
            return {
              id: sale.id,
              orderNumber: sale.orderNumber,
              employeeName: sale.employeeName,
              customerName: sale.customerName,
              paymentType: sale.paymentType,
              totalValue:  sale.totalValue,
              dtSale: format(parseISO(sale.dtSale), "dd/MM/yyyy", {
                locale: ptBR,
              }),
            };
          });
          setRowData(saleList);
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

  const handleClickOpen = (rowSelected) => {
    setOpenDialog(true);
    setRowSelected(rowSelected);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = () => {
    api
      .delete(`/sale/${rowSelected.id}`)
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
          .get("/sale")
          .then((response) => {
            if (response.data.success) {
              setRowData(response.data.saleList);
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
      <h1>Vendas</h1>
      <Grid container>
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
                // width: 500,
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
            Deseja Excluir a venda abaixo? <br />
            <strong>Cliente: {rowSelected.customerName}</strong> <br />
            <strong>Pagamento: {rowSelected.paymentType}</strong> <br />
            <strong>Valor: R${rowSelected.totalValue}</strong> <br />
            <strong>Data da Venda: {rowSelected.dtSale}</strong> <br />
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

export default withAuth(ListSales);
