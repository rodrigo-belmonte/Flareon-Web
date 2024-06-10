import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Snackbar,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  AlertColor,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { api } from "../../../services/api";
import { useRouter } from "next/router";
import withAuth from "../../../components/PrivateRoute/withAuth";
import Link from "next/link";
import { AxiosError } from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type User = {
  id: string;
  userName: string;
  employeeId: string;
  password: string;
  roleName: string;
};
type EmployeeSelect = {
  key: string;
  id: string;
  name: string;
};

function EditUser() {
  const router = useRouter();
  const id = router.query.slug;
  const [values, setValues] = useState<User>({
    id: "",
    employeeId: "",
    roleName: "",
    userName: "",
    password: "",
  });
  const [employes, setEmployes] = useState<EmployeeSelect[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      if (!loaded) {
        await api
          .get(`/user/${id}`)
          .then((response) => {
            if (response.data.success == true) {
              const resUser: User = {
                id: response.data.user.id,
                employeeId: response.data.user.employeeId,
                userName:
                  response.data.user.userName == null
                    ? ""
                    : response.data.user.userName,
                password:
                  response.data.user.password == null
                    ? ""
                    : response.data.user.password,
                roleName:
                  response.data.user.roleName == null
                    ? ""
                    : response.data.user.roleName,
              };
              setValues(resUser);
            } else {
              setSeveritySnackbar("error");
              setSnackBarTitle("Erro ao Carregar Usuário:");
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

        let employesResponse: EmployeeSelect[] = [];

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
  const Put = async () => {
    if (Validator()) {
      const employeeName = employes.find(
        (e) => e.id === values.employeeId
      ).name;

      const user = {
        id: values.id,
        employeeId: values.employeeId,
        name: employeeName,
        userName: values.userName,
        password: values.password,
        roleName: values.roleName,
      };
      await api
        .put("/user", user)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);
            router.push("/users");
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
    if (
      values.employeeId == "" ||
      values.userName == "" ||
      values.password == "" ||
      values.roleName == ""
    ) {
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
      <h1>Editar Usuário</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <FormControl
              sx={{ m: 5, width: 300 }}
              variant="standard"
              required
              error={values.employeeId == ""}
            >
              <InputLabel htmlFor="EmployeeId">Funcionário</InputLabel>
              <Select
                labelId="EmployeeId"
                id="EmployeeId"
                name="employeeId"
                value={values.employeeId}
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
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <FormControl
              sx={{ m: 5, width: 200 }}
              variant="standard"
              required
              error={values.roleName == ""}
            >
              <InputLabel htmlFor="roleName">Perfil</InputLabel>
              <Select
                labelId="roleName"
                id="roleName"
                name="roleName"
                value={values.roleName}
                label="roleName"
                onChange={handleChange}
              >
                <MenuItem value={"Administrador"}>Administrador</MenuItem>
                <MenuItem value={"Usuario Administrativo"}>
                  Usuario Administrativo
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{ m: 5, width: 300 }}
              variant="filled"
              required
              error={values.userName == ""}
            >
              <InputLabel htmlFor="userName">Nome do Usuário</InputLabel>
              <Input
                id="userName"
                name="userName"
                value={values.userName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              sx={{ m: 5, width: 300 }}
              variant="filled"
              required
              error={values.password == ""}
            >
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
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Put}>
              SALVAR
            </Button>
            <Link href="/users">
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

export default withAuth(EditUser);
