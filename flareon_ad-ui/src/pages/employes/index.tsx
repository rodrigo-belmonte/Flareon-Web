import { useEffect, useState } from "react";

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
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColDef } from "ag-grid-community";

function ListEmployes() {
  const [rowData, setRowData] = useState();
  const [hiddenRole, setHiddenCnpj] = useState<boolean>(false);
 
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "name", headerName: "Nome", flex: 1, sortable: true  },
    {
      field: "telephone",
      headerName: "Telefone",
      width: 150,
      floatingFilter: false,
    },
    { field: "occupation", headerName: "Função", flex: 1, sortable: true  },
    { field: "dtAdmission", headerName: "Data Admissão", width:200, sortable: true  },
    {
      field: "options",
      headerName: "",
      cellRenderer: (params) => {
        const rowSelected = params.data;
        return (
          <div>
            <Link href={`employes/edit/${rowSelected.id}`}>
              <a>
                <EditIcon />
              </a>
            </Link>
            <a onClick={() => handleClickOpen(rowSelected)}>
              <DeleteIcon />
            </a>
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
    name: "",
    telephone: "",
    occupation: "",
    dtAdmission: "",
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
      .get("/employee")
      .then((response) => {
        if (response.data.success) {
          const employeeList = response.data.employeeList.map((employee) => {
            return {
              id: employee.id,
              name: employee.name,
              telephone: employee.telephone,
              occupation: employee.occupation,
              dtAdmission: format(parseISO(employee.dtAdmission), "dd/MM/yyyy", {
                locale: ptBR,
              }),
            };
          });
          setRowData(employeeList);
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
      .delete(`/employee/${rowSelected.id}`)
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
          .get("/employee")
          .then((response) => {
            if (response.data.success) {
              setRowData(response.data.employeeList);
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
      <h1>Funcionários</h1>
      <Grid container>
        <Grid item xs={12}>
          <Link href={"employes/new"} className="newButton">
            <Button variant="contained">Novo Funcionário</Button>
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
            Deseja Excluir o Funcionário {rowSelected.name}?
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

export default withAuth(ListEmployes);
