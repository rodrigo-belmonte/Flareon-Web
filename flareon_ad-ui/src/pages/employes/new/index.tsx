import { ChangeEvent, useState } from "react";

import {
  Alert,
  Snackbar,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Select,
  MenuItem,
  AlertColor,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/router";
import { api } from "../../../services/api";
import withAuth from "../../../components/PrivateRoute/withAuth";
import NumberFormat from "react-number-format";
import Link from "next/link";
import { AxiosError } from "axios";
import { apiViaCEP } from "../../../services/apiViaCep";
import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";

type Employee = {
  name: string;
  lastName: string;
  sex: string;
  dtBirth: Date;
  telephone: string;
  email: string;
  cep: string;
  streetAddress: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  hiringType: string;
  cpf: string;
  cnpj: string;
  occupation: string;
  dtAdmission: Date;
  wage: string;
  paymentDay: number;
};
type ViaCepResponse = {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  siafi: string;
  uf: string;
  erro: string;
};

const daysOfMonth = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

function NewEmployee() {
  const router = useRouter();
  const [values, setValues] = useState<Employee>({
    name: "",
    lastName: "",
    telephone: "",
    dtBirth: new Date(),
    sex: "",
    email: "",
    cep: "",
    streetAddress: "",
    addressNumber: "",
    addressComplement: "",
    neighborhood: "",
    city: "",
    state: "",
    hiringType: "",
    cnpj: "",
    cpf: "",
    occupation: "",
    dtAdmission: new Date(),
    paymentDay: 5,
    wage: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");
  const [hiddenCnpj, setHiddenCnpj] = useState<boolean>(false);

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

    if (event.target.name == "hiringType") {
      setHiddenCnpj(event.target.value === "CLT" ? true : false);
    }
  };

  const Post = () => {
    if (Validator()) {
      const employee = {
        name: values.name,
        lastName: values.lastName,
        dtBirth: values.dtBirth,
        sex: values.sex,
        telephone: values.telephone,
        email: values.email,
        cep: values.cep,
        streetAddress: values.streetAddress,
        addressNumber: values.addressNumber,
        addressComplement: values.addressComplement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        hiringType: values.hiringType,
        cnpj: values.hiringType === "CLT" ? "" : values.cnpj,
        cpf: values.cpf,
        occupation: values.occupation,
        dtAdmission: values.dtAdmission,
        paymentDay: values.paymentDay,
        wage: Number.parseFloat(values.wage).toFixed(2),
      };

      console.log(values);
      console.log(employee);
      api
        .post("/employee", employee)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);

            router.push("/employes");
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

  const GetAddress = () => {
    const cep = values.cep.replaceAll("_", "").replace("-", "").trim();
    if (cep.length > 0) {
      if (cep.length != 8) {
        setSeveritySnackbar("warning");
        setSnackBarTitle("Não foi possível carregar o endereço:");
        setSnackBarMessage("Verifique o número de caracteres do CEP");
        setOpenSnackbar(true);
      } else {
        apiViaCEP
          .get(`${cep}/json/`)
          .then((response) => {
            const viaCepResponse: ViaCepResponse = response.data;
            if (viaCepResponse.erro === "true") {
              setSeveritySnackbar("error");
              setSnackBarTitle("Erro ao Carregar Endereço:");
              setSnackBarMessage("Verifique o CEP digitado e tente novamente");
              setOpenSnackbar(true);
            } else {
              setValues({
                ...values,
                city: viaCepResponse.localidade,
                streetAddress: viaCepResponse.logradouro,
                state: viaCepResponse.uf,
                neighborhood: viaCepResponse.bairro,
              });
            }
          })
          .catch((error: AxiosError) => {
            setSeveritySnackbar("error");
            setSnackBarTitle("Erro ao Carregar Endereço:");
            setSnackBarMessage("Verifique o CEP digitado e tente novamente");
            setOpenSnackbar(true);
          });
      }
    }
  };

  const Validator = () => {
    // Validador de E-mail

    //Birth Date != Ano atual - 10

    
    //Campos obrigatórios
    if (
      values.name == "" ||
      values.lastName == "" ||
      values.telephone == "" ||
      values.email == "" ||
      values.hiringType == "" ||
      values.cpf == "" ||
      values.occupation == "" ||
      values.wage == ""
    ) {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Favor preencher os campos obrigatórios.");
      setOpenSnackbar(true);
      return false;
    }

    //CNPJ
    if (values.hiringType === "PJ" && values.cnpj == "") {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Para contratação tipo PJ o CNPJ deve ser informado!");
      setOpenSnackbar(true);
      return false;
    }
    
    return true;
  };

  return (
    <div className={"box new-edit"}>
      <h1>Novo Funcionário</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12} md={5}>
                <FormControl
                  sx={{ m: 2, width: 200 }}
                  variant="filled"
                  required
                  error={values.name == ""}
                >
                  <InputLabel htmlFor="Name">Nome</InputLabel>
                  <Input
                    id="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl
                  sx={{ m: 2, width: 250 }}
                  variant="filled"
                  required
                  error={values.lastName == ""}
                >
                  <InputLabel htmlFor="LastName">Sobrenome</InputLabel>
                  <Input
                    id="LastName"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 200 }} variant="standard">
                  <InputLabel htmlFor="Sex">Sexo</InputLabel>
                  <Select
                    labelId="Sex"
                    id="Sex"
                    name="sex"
                    value={values.sex}
                    label="Sex"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Masculino"}>Masculino</MenuItem>
                    <MenuItem value={"Feminino"}>Feminino</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DatePicker
                    disableFuture
                    label="Data de Nascimento"
                    minDate={new Date("01/01/1922")}
                    maxDate={new Date()}
                    value={values.dtBirth}
                    onChange={(newValue) => {
                      setValues({
                        ...values,
                        dtBirth: newValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField sx={{ width: 250, m: 2 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={7}>
                <FormControl
                  sx={{ m: 2, width: 200 }}
                  variant="filled"
                  required
                  error={values.telephone == ""}
                >
                  <InputLabel htmlFor="Telephone">Telefone</InputLabel>
                  <NumberFormat
                    id="Telephone"
                    name="telephone"
                    value={values.telephone}
                    onChange={handleChange}
                    customInput={Input}
                    mask="_"
                    format="(##)#####-####"
                  />
                </FormControl>
                <FormControl
                  sx={{ m: 2, width: 250 }}
                  variant="filled"
                  required
                  error={values.email == ""}
                >
                  <InputLabel htmlFor="Email">E-mail</InputLabel>
                  <Input
                    id="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="Cep">CEP</InputLabel>
                  <NumberFormat
                    id="Cep"
                    name="cep"
                    value={values.cep}
                    onChange={handleChange}
                    customInput={Input}
                    mask="_"
                    format="#####-###"
                    onBlur={GetAddress}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: 365 }} variant="filled">
                  <InputLabel htmlFor="address">Logradouro</InputLabel>
                  <Input
                    id="address"
                    name="streetAddress"
                    value={values.streetAddress}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="Neighborhood">Bairro</InputLabel>
                  <Input
                    id="Neighborhood"
                    name="neighborhood"
                    value={values.neighborhood}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="addressNumber">Número</InputLabel>
                  <NumberFormat
                    id="addressNumber"
                    name="addressNumber"
                    value={values.addressNumber}
                    onChange={handleChange}
                    customInput={Input}
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="addressComplement">
                    Complemento
                  </InputLabel>
                  <Input
                    id="addressComplement"
                    name="addressComplement"
                    value={values.addressComplement}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="City">Cidade</InputLabel>
                  <Input
                    id="City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl sx={{ m: 2, width: 150 }} variant="filled">
                  <InputLabel htmlFor="State">Estado</InputLabel>
                  <Input
                    id="State"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12} md={3}>
                <FormControl
                  sx={{ m: 2, width: 200 }}
                  variant="standard"
                  required
                  error={values.hiringType == ""}
                >
                  <InputLabel htmlFor="hiringType">
                    Tipo de Contratação
                  </InputLabel>
                  <Select
                    labelId="hiringType"
                    id="hiringType"
                    name="hiringType"
                    value={values.hiringType}
                    label="Tipo de Contratação"
                    onChange={handleChange}
                  >
                    <MenuItem value={"PJ"}>PJ</MenuItem>
                    <MenuItem value={"CLT"}>CLT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControl
                  sx={{ m: 2, width: 200 }}
                  variant="filled"
                  required
                  error={values.cpf == ""}
                >
                  <InputLabel htmlFor="Cpf">CPF</InputLabel>
                  <NumberFormat
                    id="Cpf"
                    name="cpf"
                    value={values.cpf}
                    onChange={handleChange}
                    customInput={Input}
                    mask="_"
                    format="###.###.###-##"
                  />
                </FormControl>
                {hiddenCnpj === false ? (
                  <FormControl
                    sx={{ m: 2, width: 200 }}
                    variant="filled"
                    required
                    error={values.cnpj == ""}
                  >
                    <InputLabel htmlFor="Cnpj">CNPJ</InputLabel>
                    <NumberFormat
                      id="Cnpj"
                      name="cnpj"
                      value={values.cnpj}
                      onChange={handleChange}
                      customInput={Input}
                      mask="_"
                      format="##.###.###/####-##"
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12} md={5}>
                <FormControl
                  sx={{ m: 2, width: 300 }}
                  variant="standard"
                  required
                  error={values.occupation == ""}
                >
                  <InputLabel htmlFor="occupation">Cargo</InputLabel>
                  <Select
                    labelId="occupation"
                    id="occupation"
                    name="occupation"
                    value={values.occupation}
                    label="Cargo"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Costureira"}>Costureira</MenuItem>
                    <MenuItem value={"Caixa"}>Caixa</MenuItem>
                    <MenuItem value={"Gerente"}>Gerente</MenuItem>
                    <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  sx={{ m: 2 }}
                  variant="filled"
                  required
                  error={values.wage == ""}
                >
                  <InputLabel htmlFor="wage">Salário</InputLabel>
                  <NumberFormat
                    id="wage"
                    name="wage"
                    value={values.wage}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={7}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                  required
                >
                  <DatePicker
                    disableFuture
                    label="Data de Admissão"
                    minDate={new Date("01/01/1990")}
                    maxDate={new Date()}
                    value={values.dtAdmission}
                    onChange={(newValue) => {
                      setValues({
                        ...values,
                        dtAdmission: newValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField sx={{ width: 200, m: 2 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
                <Autocomplete
                  autoSelect
                  autoHighlight
                  id="combo-box-demo"
                  options={daysOfMonth}
                  sx={{ width: 200, m: 2, display: "inline-flex" }}
                  value={values.paymentDay}
                  onChange={(event: any, newValue: number | null) => {
                    setValues({
                      ...values,
                      paymentDay: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Dia de pagamento" />
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Post}>
              SALVAR
            </Button>
            <Link href="/employes">
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

export default withAuth(NewEmployee);
