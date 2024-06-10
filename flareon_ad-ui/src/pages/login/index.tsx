import {
  Alert,
  AlertColor,
  Box,
  Button,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
} from "@mui/material";
import React, { ChangeEvent, Key, useEffect, useState } from "react";
import styles from "./login.module.scss";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { api } from "../../services/api";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { AxiosError } from "axios";

interface ILogin {
  user: string;
  password: string;
  showPassword: boolean;
}

function Login() {
  const router = useRouter();

  const [values, setValues] = useState<ILogin>({
    user: "",
    password: "",
    showPassword: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangePassword =
    (prop: keyof ILogin) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      Login();
    }
  };
  const Login = () => {
    const user = {
      user: values.user,
      password: values.password,
    };
    if (user.user === "") {
      setSeveritySnackbar("error");
      setSnackBarTitle("Erro Realizar Login:");
      setSnackBarMessage("Usuário não definido");
      setOpenSnackbar(true);
    } else {
      api
        .post("/auth/login", user)
        .then((response) => {
          if (response.data.success === true) {
            if (response.data.message !== null) {
              setSeveritySnackbar("error");
              setSnackBarTitle("Erro Realizar Login:");
              setSnackBarMessage(response.data.message);
              setOpenSnackbar(true);
            } else {
              console.log(response.data.userInfo);
              const id = JSON.stringify(response.data.userInfo.id);
              const username = JSON.stringify(response.data.userInfo.name);
              const role = JSON.stringify(response.data.userInfo.roleName);
              const token = JSON.stringify(response.data.token);
              destroyCookie(null, "idUser");
              destroyCookie(null, "user");
              destroyCookie(null, "role");
              destroyCookie(null, "token");
              
              setCookie(null, "idUser", id, {
                maxAge: 1 * 24 * 60 * 60,
                path: "/",
              });
              setCookie(null, "user", username, {
                maxAge: 1 * 24 * 60 * 60,
                path: "/",
              });
              setCookie(null, "role", role, {
                maxAge: 1 * 24 * 60 * 60,
                path: "/",
              });
              setCookie(null, "token", token, {
                maxAge: 1 * 24 * 60 * 60,
                path: "/",
              });

              router.push("/");
            }
          } else {
            setSeveritySnackbar("error");
            setSnackBarTitle("Erro ao Realizar Login:");
            const errors: string[] = response.data.validationErrors;
            setSnackBarMessage(errors.join(" - "));
            setOpenSnackbar(true);
          }
        })
        .catch((error: AxiosError) => {
          setSeveritySnackbar("error");
          setSnackBarTitle("Erro ao Realizar Login:");
          setSnackBarMessage(error.message);
          setOpenSnackbar(true);
        });
    }
  };
  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar
  return (
    <div className={styles.page}>
      <Grid container>
        <Grid xs={0} sm={6} item>
          <div className={styles.imageBox}>
            <img src="/LOGO-FLAREONAD.png" alt="" />
          </div>
        </Grid>
        <Grid xs={12} sm={6} item>
          <div className={styles.loginBox}>
            <Box
              component="form"
              sx={{
                m: 5,
                width: 400,
                height: 400,
                backgroundColor: "#595655",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <div className={styles.inputBox}>
                <FormControl
                  sx={{
                    m: 1,
                    backgroundColor: "#fff",
                    ":focus": {
                      backgroundColor: "#fff",
                    },
                    ":hover": {
                      backgroundColor: "#fff",
                    },
                  }}
                  variant="filled"
                >
                  <InputLabel htmlFor="user">Usuário</InputLabel>
                  <FilledInput
                    fullWidth
                    id="user"
                    name="user"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                    value={values.user}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl
                  className="input"
                  sx={{
                    m: 1,
                    backgroundColor: "#fff",
                    ":focus": {
                      backgroundColor: "#fff",
                    },
                    ":hover": {
                      backgroundColor: "#fff",
                    },
                  }}
                  variant="filled"
                >
                  <InputLabel htmlFor="password">Senha</InputLabel>
                  <FilledInput
                    fullWidth
                    id="password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChangePassword("password")}
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box sx={{ py: 2, m: 5, textAlign: "center" }}>
                  <Button
                    color="success"
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={Login}
                  >
                    Entrar
                  </Button>
                  {/* <Link to="/" className={styles.forgotPassword}>
                    Esqueçeu a Senha?
                  </Link> */}
                </Box>
              </div>
            </Box>
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

export default Login;
