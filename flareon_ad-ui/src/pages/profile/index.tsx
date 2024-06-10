import { ChangeEvent, useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  AlertColor,
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { parseCookies } from "nookies";

function Profile() {
  const [values, setValues] = useState<any>({
    id: "",
    name: "",
    lastName: "",
    telephone: "",
    email: "",
    userName: "",
    role: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");
  const cookies = parseCookies();
  useEffect(() => {
    const url = `/user/GetProfileById/${cookies.idUser.replaceAll('"', "")}`;

    api.get(url).then((response) => {
      if (response.data.success == true) {
        const resUser = {
          id: response.data.profile.id,
          name: response.data.profile.name,
          userName: response.data.profile.userName,
          lastName: response.data.profile.lastName,
          telephone: response.data.profile.telephone,
          email: response.data.profile.email,
          role: response.data.profile.roleName,
          password: response.data.profile.password,
        };
        setValues(resUser);
      }
    });
  }, []);
  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  const PutPassword = () => {
    const data = {
      Id: values.id,
      Password: values.password
    };

    api
      .put("/user/ChangePassword/", data)
      .then((response) => {
        if (response.data.success === true) {
          setSeveritySnackbar("success");
          setSnackBarTitle("Senha atualizada Sucesso!");
          setSnackBarMessage("");
          setOpenSnackbar(true);
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    showPassword == false ? setShowPassword(true) : setShowPassword(false);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <div className="box">
      <h1>Perfil</h1>
      <Grid container>
        <div className={"formBox"}>
          <Grid item xs={12}>
            <FormControl sx={{ m: 5, width: 500 }} variant="filled">
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input id="name" name="name" value={values.name} disabled />
            </FormControl>
            <FormControl sx={{ m: 5, width: 500 }} variant="filled">
              <InputLabel htmlFor="lastName">Sobrenome</InputLabel>
              <Input
                id="lastName"
                name="lastName"
                value={values.lastName}
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ m: 5, width: 500 }} variant="filled">
              <InputLabel htmlFor="telephone">Telefone</InputLabel>
              <Input
                id="telephone"
                name="telephone"
                value={values.telephone}
                disabled
              />
            </FormControl>
            <FormControl sx={{ m: 5, width: 500 }} variant="filled">
              <InputLabel htmlFor="email">E-mail</InputLabel>
              <Input id="email" name="email" value={values.email} disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ m: 5, width: 300 }} variant="filled">
              <InputLabel htmlFor="userName">Usuário</InputLabel>
              <Input
                id="userName"
                name="userName"
                value={values.userName}
                disabled
              />
            </FormControl>
            <FormControl sx={{ m: 5, width: 300 }} variant="filled">
              <InputLabel htmlFor="role">Perfil</InputLabel>
              <Input id="role" name="role" value={values.role} disabled />
            </FormControl>
            <FormControl sx={{ m: 5, width: 300 }} variant="filled">
              <InputLabel htmlFor="Password">Senha</InputLabel>
              <Input
                id="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              color="success"
              onClick={PutPassword}
            >
              Alterar Senha
            </Button>
          </Grid>
        </div>
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

export default withAuth(Profile);
