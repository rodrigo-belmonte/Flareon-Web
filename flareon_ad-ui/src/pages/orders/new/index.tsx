import * as React from "react";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Alert,
  Snackbar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  AlertColor,
  TextField,
} from "@mui/material";
import { api } from "../../../services/api";
import { useRouter } from "next/router";
import withAuth from "../../../components/PrivateRoute/withAuth";
import Link from "next/link";
import { AxiosError } from "axios";
import { uuid } from "uuidv4";
import PieceComponent from "../components/pieceComponent";
import { ptBR } from "date-fns/locale";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { CustomerSelectVm } from "../../../types/Customer/tpCustomerSelectVm";
import { EmployeeSelectVm } from "../../../types/Employee/tpEmployeeSelectVm";
import { CreateOrder } from "../../../types/Order/Request/CreateOrder";
import { CustomerSelect } from "../../../types/Order/tpCustomerSelect";
import { EmployeeSelect } from "../../../types/Order/tpEmployeeSelect";
import { OrderVm } from "../../../types/Order/tpOrderVm";
import { PieceClothing } from "../../../types/Order/tpPieceClothing";
import { ProductSelect } from "../../../types/Products/tpProductSelect";

function NewOrder() {
  const router = useRouter();

  const [dtWithdrawal, setDtWithdrawal] = useState<Date>(new Date());

  const [order, setOrder] = useState<OrderVm>({
    id: "",
    orderNumber: "",
    customer: { id: "", name: "" },
    employee: { id: "", name: "" },
    production: true,
    pieces: [],
    totalValue: 0,
    dtWithdrawal: "",
    dtCompletion: ""
  });

  const [customers, setCustomers] = useState<CustomerSelect[]>([]);
  const [employes, setEmployes] = useState<EmployeeSelect[]>([]);
  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [productsName, setProductsName] = useState<string[]>([]);

  const [pieces, setPieces] = useState<PieceClothing[]>([]);
  const [pieceToUpdate, setPieceToUpdate] = useState<PieceClothing>();
  const [pieceToDelete, setPieceToDelete] = useState<PieceClothing>();

  const [pieceComponents, setPieceComponents] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  const [loaded, setLoaded] = useState<boolean>(false);

  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  useEffect(() => {
    let customersResponse: CustomerSelect[] = [];
    let employesResponse: EmployeeSelect[] = [];
    let productsResponse: ProductSelect[] = [];

    async function fetchData() {
      if (!loaded) {
        await GetCustomers(
          customersResponse,
          setSeveritySnackbar,
          setSnackBarTitle,
          setSnackBarMessage,
          setOpenSnackbar
        );

        await GetEmployes(
          employesResponse,
          setSeveritySnackbar,
          setSnackBarTitle,
          setSnackBarMessage,
          setOpenSnackbar
        );

        await GetProducts(
          productsResponse,
          setSeveritySnackbar,
          setSnackBarTitle,
          setSnackBarMessage,
          setOpenSnackbar
        );
        setCustomers(customersResponse);
        setEmployes(employesResponse);
        setProducts(productsResponse);
        setLoaded(true);
      }
    }

    fetchData();
  }, []);

  //UpdatePiece
  useEffect(() => {
    async function UpdatePieces() {
      if (pieceToUpdate != null) {
        let pieceAlreadyExists = pieces.find((p) => {
          return p.id === pieceToUpdate.id;
        });

        if (pieceAlreadyExists != null) {
          let newState = pieces.map((p) => {
            if (p.id === pieceToUpdate.id) {
              let sumTotalProds = 0;
              if (p.products.length < 0) {
                sumTotalProds = p.products
                  .map((prod) => prod.total)
                  .reduce((a, b) => a + b);
              }
              return {
                ...p,
                name: pieceToUpdate.name,
                description: pieceToUpdate.description,
                products: pieceToUpdate.products,
                total: sumTotalProds,
              };
            }
            return p;
          });
          newState = newState.filter((p) => p.id !== "");
          setPieces(newState);

          setOrder({
            ...order,
            pieces: newState,
          });
        } else setPieces((current) => [...current, pieceToUpdate]);
        setPieceToUpdate(null);
        console.log(pieces);
      }
    }
    UpdatePieces();
  }, [pieceToUpdate, pieces]);

  //DeletePiece
  useEffect(() => {
    if (pieceToDelete !== null) {
      const piecesfiltered = pieces.filter((piece) => {
        return piece.id !== pieceToDelete.id;
      });
      setPieces(piecesfiltered);
      setPieceComponents([]);

      if (pieces.find((p) => p.id === pieceToDelete.id) === undefined) {
        const arrayPieceComponent = [];
        pieces.map((p) => {
          const newPiece = React.createElement(PieceComponent, {
            _piece: p,
            _productsName: productsName,
            _products: products,
            _onChange: handlePieceChange,
            _readOnly: false,
          });
          arrayPieceComponent.push(newPiece);
        });
        setPieceComponents(arrayPieceComponent);
      }

      if (
        pieces.find((p) => p.id === pieceToDelete.id) === undefined &&
        pieceComponents.length === pieces.length
      ) {
        setPieceToDelete(null);
      }
    }
  }, [pieceComponents, pieceToDelete, pieces]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "customer") {
      const customer: CustomerSelectVm = {
        id: event.target.value,
        name: customers.filter((c) => c.id === event.target.value)[0].name,
      };
      setOrder({
        ...order,
        customer: customer,
      });
    } else if (event.target.name === "employee") {
      const employee: EmployeeSelectVm = {
        id: event.target.value,
        name: employes.filter((c) => c.id === event.target.value)[0].name,
      };
      setOrder({
        ...order,
        employee: employee,
      });
    } else {
      setOrder({
        ...order,
        [event.target.name]: event.target.value,
      });
    }
  };
  function ProdAlreadyInserted() {
    setSeveritySnackbar("warning");
    setSnackBarTitle("Atenção");
    setSnackBarMessage("Produto já inserido");
    setOpenSnackbar(true);
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder({
      ...order,
      production: event.target.checked,
    });
  };

  const Post = () => {
    if (Validator()) {
      const createOrder: CreateOrder = {
        employeeId: order.employee.id,
        customerId: order.customer.id,
        pieces: pieces.filter((p) => p.id !== ""),
        production: order.production,
        dtWithdrawal: format(dtWithdrawal, "dd/MM/yyyy hh:mm:ss", {
          locale: ptBR,
        }),
      };

      api
        .post("/order", createOrder)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);
            router.push("/orders");
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

  const GoToSale = async () => {
    if (Validator()) {
      const createOrder: CreateOrder = {
        employeeId: order.employee.id,
        customerId: order.customer.id,
        pieces: pieces.filter((p) => p.id !== ""),
        production: order.production,
        dtWithdrawal: format(dtWithdrawal, "dd/MM/yyyy hh:mm:ss", {
          locale: ptBR,
        }),
      };

      await api
        .post("/order", createOrder)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);
            const orderId = response.data.orderId;
            router.push(`/sales/new/${orderId}`);
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
    if (order.employee.id == "" || order.customer.id == "") {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Favor preencher os campos obrigatórios.");
      setOpenSnackbar(true);
      return false;
    }
    if (new Date(dtWithdrawal) < new Date()) {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Data de retirada deve ser maior que data atual.");
      setOpenSnackbar(true);
      return false;
    }
    if (pieces.length <= 0) {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Adicione pelo menos uma peça.");
      setOpenSnackbar(true);
      return false;
    }
    pieces.forEach((piece) => {
      if (piece.products.length <= 0) {
        setSeveritySnackbar("warning");
        setSnackBarTitle("Atenção:");
        setSnackBarMessage("Adicione pelo menos um produto na peça.");
        setOpenSnackbar(true);
        return false;
      }
    });
    return true;
  };

  const handlePieceChange = (value: PieceClothing) => {
    if (value.action == "delete") {
      setPieceToDelete(value);
    } else setPieceToUpdate(value);
  };

  function createPiece() {
    const emptyPiece: PieceClothing = {
      name: "",
      id: uuid(),
      description: "",
      products: [],
      total: 0,
      action: "",
    };
    const newPiece = React.createElement(PieceComponent, {
      _piece: emptyPiece,
      _productsName: productsName,
      _products: products,
      _onChange: handlePieceChange,
      _readOnly: false,
    });
    setPieceComponents([...pieceComponents, newPiece]);

    console.log(pieces);
  }

  return (
    <div className={"box new-edit"}>
      <h1>Nova Comanda</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12}>
                <FormControl
                  sx={{ m: 5, width: 300 }}
                  variant="standard"
                  required
                  error={order.employee.id == ""}
                >
                  <InputLabel htmlFor="EmployeeId">Funcionário</InputLabel>
                  <Select
                    labelId="EmployeeId"
                    key={order.employee.id}
                    id="EmployeeId"
                    name="employee"
                    value={order.employee.id}
                    label="EmployeeId"
                    onChange={handleChange}
                  >
                    {employes.map((employee) => (
                      <MenuItem key={employee.key} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  sx={{ m: 5, width: 300 }}
                  variant="standard"
                  required
                  error={order.customer.id == ""}
                >
                  <InputLabel htmlFor="CustomerId">Cliente</InputLabel>
                  <Select
                    key={order.customer.id}
                    labelId="CustomerId"
                    id="CustomerId"
                    name="customer"
                    value={order.customer.id}
                    label="CustomerId"
                    onChange={handleChange}
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.key} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  sx={{ m: 6 }}
                  control={
                    <Checkbox
                      checked={order.production}
                      value={order.production}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Em Produção"
                />
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DatePicker
                    label="Data Retirada"
                    value={dtWithdrawal}
                    onChange={(newValue) => {
                      setDtWithdrawal(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField sx={{ m: 6 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12}>
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            color="success"
            onClick={createPiece}
          >
            Nova Peça
          </Button>
          {pieceComponents}
        </Grid>

        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Post}>
              SALVAR
            </Button>
            <Button variant="contained" color="primary" onClick={GoToSale}>
              SALVAR E VENDER
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
    </div>
  );
}

async function GetProducts(
  productsResponse: ProductSelect[],
  setSeveritySnackbar: React.Dispatch<React.SetStateAction<AlertColor>>,
  setSnackBarTitle: React.Dispatch<React.SetStateAction<string>>,
  setSnackBarMessage: React.Dispatch<React.SetStateAction<string>>,
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>
) {
  await api
    .get("/product")
    .then((response) => {
      if (response.data.success == true) {
        response.data.productList.forEach((productResponse) => {
          const product: ProductSelect = {
            key: productResponse.id,
            id: productResponse.id,
            name: productResponse.name,
            price: productResponse.price,
          };
          productsResponse.push(product);
        });
      } else {
        setSeveritySnackbar("error");
        setSnackBarTitle("Erro ao Produtos:");
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
}

async function GetEmployes(
  employesResponse: EmployeeSelect[],
  setSeveritySnackbar: React.Dispatch<React.SetStateAction<AlertColor>>,
  setSnackBarTitle: React.Dispatch<React.SetStateAction<string>>,
  setSnackBarMessage: React.Dispatch<React.SetStateAction<string>>,
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>
) {
  await api
    .get("/employee")
    .then((response) => {
      if (response.data.success == true) {
        response.data.employeeList.forEach((employeeResponse) => {
          const employee: EmployeeSelect = {
            key: employeeResponse.id,
            id: employeeResponse.id,
            name: employeeResponse.name,
          };
          employesResponse.push(employee);
        });
      } else {
        setSeveritySnackbar("error");
        setSnackBarTitle("Erro ao Carregar Funcionários:");
        const errors: string[] = response.data.validationErrors;
        setSnackBarMessage(errors.join(" - "));
        setOpenSnackbar(true);
      }
    })
    .catch((error: AxiosError) => {
      setSeveritySnackbar("error");
      setSnackBarTitle("Erro ao Carregar Funcionários:");
      setSnackBarMessage(error.message);
      setOpenSnackbar(true);
    });
}

async function GetCustomers(
  customersResponse: CustomerSelect[],
  setSeveritySnackbar: React.Dispatch<React.SetStateAction<AlertColor>>,
  setSnackBarTitle: React.Dispatch<React.SetStateAction<string>>,
  setSnackBarMessage: React.Dispatch<React.SetStateAction<string>>,
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>
) {
  await api
    .get("/customer")
    .then((response) => {
      if (response.data.success == true) {
        response.data.customerList.forEach((customerResponse) => {
          const customer: CustomerSelect = {
            key: customerResponse.id,
            id: customerResponse.id,
            name: customerResponse.name,
          };
          customersResponse.push(customer);
        });
      } else {
        setSeveritySnackbar("error");
        setSnackBarTitle("Erro ao Carregar Clientes:");
        const errors: string[] = response.data.validationErrors;
        setSnackBarMessage(errors.join(" - "));
        setOpenSnackbar(true);
      }
    })
    .catch((error: AxiosError) => {
      setSeveritySnackbar("error");
      setSnackBarTitle("Erro ao Carregar Clientes:");
      setSnackBarMessage(error.message);
      setOpenSnackbar(true);
    });
}

export default withAuth(NewOrder);
