import { ColDef } from "ag-grid-community";
import { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  Alert,
  Snackbar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  AlertColor,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AgGridReact } from "ag-grid-react";
import withAuth from "../../../components/PrivateRoute/withAuth";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PrintDialog from "../components/printDialog";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import PieceComponent from "../components/pieceComponent";
import { GetByIdOrderVm } from "../../../types/Order/tpGetByIdOrderVm";
import { OrderVm } from "../../../types/Order/tpOrderVm";
import { PieceClothing } from "../../../types/Order/tpPieceClothing";
type Order = {
  Id: string;
  OrderNumber: string;
  Products: ProductList[];
  EmployeeName: string;
  CustomerName: string;
  DtOrder: string;
  TotalValue: Number;
};

type ProductList = {
  id: string;
  name: string;
  price: number;
  obs: string;
  quantity: number;
  total: number;
};

function ViewOrder() {
  const router = useRouter();

  const id: string | string[] = router.query.slug;
  const [dtOrder, setDtOrder] = useState<string>("");
  const [dtWithdrawal, setDtWithdrawal] = useState<Date>(new Date());
  const [dtCompletion, setDtCompletion] = useState<Date>(new Date());
  const [pieces, setPieces] = useState<PieceClothing[]>([]);

  const [order, setOrder] = useState<OrderVm>({
    id: "",
    orderNumber: "",
    customer: { id: "", name: "" },
    employee: { id: "", name: "" },
    production: true,
    pieces: [],
    totalValue: 0,
    dtWithdrawal: "",
    dtCompletion: "",
  });

  const [pieceComponents, setPieceComponents] = useState([]);

  //SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [orderLoaded, setOrderLoaded] = useState<boolean>(false);
  const [piecesLoaded, setPiecesLoaded] = useState<boolean>(false);
  const [openPrintDialog, setOpenPrintDialog] = useState<boolean>(false);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "price",
      headerName: "Preço",
      width: 100,
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },
    {
      field: "quantity",
      headerName: "Qtde",
      width: 80,
    },
    {
      field: "obs",
      headerName: "Observação",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },
  ]);

  useEffect(() => {
    async function fetchOrderData() {
      await api
        .get(`/order/${id}`)
        .then((response) => {
          if (response.data.success == true) {
            const orderResponse: GetByIdOrderVm = response.data.order;
            setOrder({
              id: orderResponse.id,
              orderNumber: orderResponse.orderNumber,
              customer: orderResponse.customer,
              employee: orderResponse.employee,
              production: orderResponse.production,
              pieces: orderResponse.pieces,
              totalValue: orderResponse.totalValue,
              dtWithdrawal: format(
                parseISO(orderResponse.dtWithdrawal),
                "dd/MM/yyyy",
                {
                  locale: ptBR,
                }
              ),
              dtCompletion: format(
                parseISO(orderResponse.dtCompletion),
                "dd/MM/yyyy",
                {
                  locale: ptBR,
                }
              ),
            });
            console.log(orderResponse);
            setOrder(orderResponse);
            setDtOrder(
              format(parseISO(orderResponse.dtOrder), "dd/MM/yyyy", {
                locale: ptBR,
              })
            );
            setDtWithdrawal(new Date(orderResponse.dtWithdrawal));

            setPieces(
              orderResponse.pieces.map((p) => {
                return {
                  id: p.id,
                  description: p.description,
                  name: p.name,
                  products: p.products,
                  total: p.total,
                  action: "",
                };
              })
            );
          } else {
            setSeveritySnackbar("error");
            setSnackBarTitle("Erro ao Carregar Comanda:");
            const errors: string[] = response.data.validationErrors;
            setSnackBarMessage(errors.join(" - "));
            setOpenSnackbar(true);
          }
        })
        .catch((error: AxiosError) => {
          setSeveritySnackbar("error");
          setSnackBarTitle("Erro ao Carregar Produtos:");
          setSnackBarMessage(error.message);
          setOpenSnackbar(true);
        });
      setOrderLoaded(true);
    }
    function fetchPiecesData() {
      const pieceComponentsArray = [];
      for (let index = 0; index < order.pieces.length; index++) {
        const pieces: PieceClothing[] = order.pieces.map((p) => {
          return {
            id: p.id,
            description: p.description,
            name: p.name,
            products: p.products,
            total: p.total,
            action: "",
          };
        });
        setPieces(pieces);
        const newPieceComponent = React.createElement(PieceComponent, {
          _piece: pieces[index],
          _productsName: [],
          _products: [],
          _onChange: handlePieceChange,
          _readOnly: true
        });
        pieceComponentsArray.push(newPieceComponent);
      }
      setPieceComponents(pieceComponentsArray);
      setPiecesLoaded(true);
    }
    
      if (!orderLoaded) fetchOrderData();
    if (order.pieces.length > 0) {
      if (!piecesLoaded) fetchPiecesData();
    }
  }, [orderLoaded,
    pieceComponents,
    piecesLoaded,]);

  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  function Print() {
    setOpenPrintDialog(openPrintDialog == false ? true : false);
  }

  const handlePieceChange = (value: PieceClothing) => {
    
  };

  return (
    <div className={"box new-edit"}>
      <h1>Visualizar Comanda</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: 365 }} variant="filled">
                  <InputLabel htmlFor="EmployeeName">Funcionário</InputLabel>
                  <Input
                    id="EmployeeName"
                    name="EmployeeName"
                    value={order.employee.name}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 365 }} variant="filled">
                  <InputLabel htmlFor="CustomerName">Cliente</InputLabel>
                  <Input
                    id="CustomerName"
                    name="CustomerName"
                    value={order.customer.name}
                    disabled
                  />
                </FormControl>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DatePicker
                    label="Data Retirada"
                    value={dtWithdrawal}
                    disabled
                    onChange={(newValue) => {
                      setDtWithdrawal(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField disabled sx={{ m: 6 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          {pieceComponents}
        </Grid>

        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Print}>
              Imprimir...
            </Button>
            <Link href="/orders">
              <Button variant="contained" color="error">
                CANCELAR
              </Button>
            </Link>
          </div>
        </Grid>
      </Grid>
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
      <PrintDialog
        _order={order}
        _dtOrder={dtOrder}
        _dtWithdrawal={dtWithdrawal}
        _dtCompletion={dtCompletion}
        _openDialog={openPrintDialog}
      />
    </div>
  );
}

export default withAuth(ViewOrder);
