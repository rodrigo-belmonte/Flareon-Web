import {
  Alert,
  AlertColor,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "../dashboard.module.scss";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AxiosError, AxiosRequestConfig } from "axios";
import withAuth from "../../components/PrivateRoute/withAuth";

type EmployeeSelect = {
  id: string;
  name: string;
};

function Report() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [reportName, setReportName] = useState("Vendas");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [employeeId, setEmployeeId] = useState<string | null>("");
  const [employes, setEmployes] = useState<EmployeeSelect[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [columnDefs, setColumnDefs] = useState([
    { field: "OrderNumber", headerName: "Comanda" },
    {
      field: "dtSale",
      headerName: "Data Venda",
      flex: 1,
      floatingFilter: false,
    },
    { field: "employeeName", headerName: "Funcionário", flex: 1 },
    { field: "customerName", headerName: "Cliente", flex: 1 },
    {
      field: "paymentType",
      headerName: "Tipo Pagamento",
      flex: 1,
      floatingFilter: false,
    },
    {
      field: "totalValue",
      headerName: "Valor",
      flex: 1,
      floatingFilter: false,
    },
  ]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  useEffect(() => {
    let employesResponse: EmployeeSelect[] = [];

    async function fetchData() {
      if (!loaded) {
        await getEmployes(employesResponse);
        setLoaded(true);
      }
    }

    fetchData();

  }, []);

  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  const onBtnExport = () => {
    // @ts-ignore
    gridRef.current.api.exportDataAsCsv();
  };

  const Search = () => {
    const obj = {
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      employeeId: employeeId,
    };

    console.log(obj);

    const config: AxiosRequestConfig = {
      params: obj,
      data: obj,
    };
    console.log(config);
    api
      .get("/sale/getSales", config)
      .then((response) => {
        if (response.data.success) {
          const saleList = response.data.saleList.map((sale) => {
            return {
              OrderNumber: sale.orderNumber,
              id: sale.id,
              employeeName: sale.employeeName,
              customerName: sale.customerName,
              paymentType: sale.paymentType,
              totalValue: "R$" + sale.totalValue,
              dtSale: format(parseISO(sale.dtSale), "dd/MM/yyyy", {
                locale: ptBR,
              }),
            };
          });
          setRowData(saleList);
          console.log(saleList)
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
  };

  return (
    <div className="box list">
      <h1>Relatórios</h1>
      <div>
        <Grid container>
          <Grid item xs={12}></Grid>
          <Grid item xs={12} className={"formBox"} sx={{ p: 2 }}>
            <h2>{reportName}</h2>
            <Box>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ptBR}
              >
                <DatePicker
                
                  label="De"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ptBR}
              >
                <DatePicker
                  label="Até"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <FormControl sx={{ ml: 2, mr: 2, width: 300 }} variant="standard">
                <InputLabel htmlFor="EmployeeId">Funcionário</InputLabel>
                <Select
                  labelId="EmployeeId"
                  id="EmployeeId"
                  name="employeeId"
                  value={employeeId}
                  label="EmployeeId"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEmployeeId(event.target.value);
                  }}
                >
                  {employes.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={Search}>
                Buscar
              </Button>
              <Button
                variant="contained"
                sx={{ float: "right" }}
                onClick={onBtnExport}
              >
                Exportar
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div
              className="ag-theme-alpine"
              style={{ height: "80vh", width: "100%" }}
            >
              <AgGridReact
                ref={gridRef}
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
          <Grid item xs={6}></Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}></Grid>
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

  async function getEmployes(employesResponse: EmployeeSelect[]) {
    await api
      .get("/employee")
      .then((response) => {
        if (response.data.success == true) {
          const employee: EmployeeSelect = {
            id: "",
            name: "Nenhum",
          };
          employesResponse.push(employee);
          console.log(response.data.employeeList);
          response.data.employeeList.forEach((employeeResponse) => {
            const employee: EmployeeSelect = {
              id: employeeResponse.id,
              name: employeeResponse.name,
            };
            employesResponse.push(employee);
          });
        } else {
          setSeveritySnackbar("error");
          setSnackBarTitle("Erro ao Carregar Lista de Funcionários:");
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

    setEmployes(employesResponse);
    if (employes.length == 0) {
      console.log(employes);
    }
  }
}

export default withAuth(Report);
