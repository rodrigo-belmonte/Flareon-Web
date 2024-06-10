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
import { ColDef } from "ag-grid-community";

function ListUsers() {
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "name", headerName: "Nome", flex: 1, sortable: true },
    { field: "username", headerName: "Usuário", flex: 1, sortable: true },
    { field: "roleName", headerName: "Perfil", flex: 1, sortable: true },
    {
      field: "options",
      headerName: "",
      cellRenderer: (params) => {
        const rowSelected = params.data;
        return (
          <div>
            <Link href={`users/edit/${rowSelected.id}`}>
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
    username: "",
    profileName: "",
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
    api.get("/user").then((response) => {
      if (response.data.success) {
        setRowData(response.data.userList);
      } else {
        setErrorMessage("Erro ao Carregar Lista:");
        setErrors(response.data.validationErrors);
        setOpenSnackbarError(true);
      }
    }).catch((error: AxiosError) => {
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
      .delete(`/user/${rowSelected.id}`)
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
          .get("/user")
          .then((response) => {
            if (response.data.success) {
              setRowData(response.data.userList);
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
      <h1>Usuários</h1>
      <Grid container>
        <Grid item xs={12}>
          <Link href={"users/new"} className="newButton">
            <Button variant="contained">Novo Usuário</Button>
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

export default withAuth(ListUsers);
