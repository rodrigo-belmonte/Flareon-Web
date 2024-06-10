import * as React from "react";
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
} from "@mui/material";
import { api } from "../../../services/api";
import { useRouter } from "next/router";
import withAuth from "../../../components/PrivateRoute/withAuth";
import NumberFormat from "react-number-format";
import Link from "next/link";
import { AxiosError } from "axios";
import { apiViaCEP } from "../../../services/apiViaCep";

type Customer = {
  id: string;
  name: string;
  sex: string;
  telephone: string;
  email: string;
  cpf: string;
  cep: string;
  streetAddress: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  measureShoulder: string;
  measureLeftArm: string;
  measureRightArm: string;
  measureChest: string;
  measureWaist: string;
  measureNavelHeight: string;
  measureHip: string;
  measureLeftLeg: string;
  measureRightLeg: string;
  measureLeftCalf: string;
  measureRightCalf: string;
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
function EditCustomer() {
  const router = useRouter();
  const id = router.query.slug;
  const [values, setValues] = useState<Customer>({
    id: "",
    name: "",
    sex: "",
    telephone: "",
    email: "",
    cpf: "",
    cep: "",
    streetAddress: "",
    addressNumber: "",
    addressComplement: "",
    neighborhood: "",
    city: "",
    state: "",
    measureShoulder: "",
    measureLeftArm: "",
    measureRightArm: "",
    measureChest: "",
    measureWaist: "",
    measureNavelHeight: "",
    measureHip: "",
    measureLeftLeg: "",
    measureRightLeg: "",
    measureLeftCalf: "",
    measureRightCalf: "",
  });

  //SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarTitle, setSnackBarTitle] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] = useState<AlertColor>("info");

  //SnackBar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  //End SnackBar

  useEffect(() => {
    const url = `/customer/${id}`;
    api.get(url).then((response) => {
      if (response.data.success == true) {
        const resCustomer: Customer = {
          id: response.data.customer.id,
          name:
            response.data.customer.name == null
              ? ""
              : response.data.customer.name,
          sex:
            response.data.customer.sex == null
              ? ""
              : response.data.customer.sex,
          email:
            response.data.customer.email == null
              ? ""
              : response.data.customer.email,
          telephone:
            response.data.customer.telephone == null
              ? ""
              : response.data.customer.telephone,
          cpf:
            response.data.customer.cpf == null
              ? ""
              : response.data.customer.cpf,
          cep:
            response.data.customer.cep == null
              ? ""
              : response.data.customer.cep,
          streetAddress:
            response.data.customer.streetAddress == null
              ? ""
              : response.data.customer.streetAddress,
          addressNumber:
            response.data.customer.addressNumber == null
              ? ""
              : response.data.customer.addressNumber,
          addressComplement:
            response.data.customer.addressComplement == null
              ? ""
              : response.data.customer.addressComplement,
          neighborhood:
            response.data.customer.neighborhood == null
              ? ""
              : response.data.customer.neighborhood,
          city:
            response.data.customer.city == null
              ? ""
              : response.data.customer.city,
          state:
            response.data.customer.state == null
              ? ""
              : response.data.customer.state,
          measureShoulder: response.data.customer.measureShoulder
            .toString()
            .replace(".", ","),
          measureLeftArm: response.data.customer.measureLeftArm
            .toString()
            .replace(".", ","),
          measureRightArm: response.data.customer.measureRightArm
            .toString()
            .replace(".", ","),
          measureChest: response.data.customer.measureChest
            .toString()
            .replace(".", ","),
          measureWaist: response.data.customer.measureWaist
            .toString()
            .replace(".", ","),
          measureNavelHeight: response.data.customer.measureNavelHeight
            .toString()
            .replace(".", ","),
          measureHip: response.data.customer.measureHip
            .toString()
            .replace(".", ","),
          measureLeftLeg: response.data.customer.measureLeftLeg
            .toString()
            .replace(".", ","),
          measureRightLeg: response.data.customer.measureRightLeg
            .toString()
            .replace(".", ","),
          measureLeftCalf: response.data.customer.measureLeftCalf
            .toString()
            .replace(".", ","),
          measureRightCalf: response.data.customer.measureRightCalf
            .toString()
            .replace(".", ","),
        };
        setValues(resCustomer);
      } else {
        console.table(response.data.validationErrors);
      }
    });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const Put = async () => {
    if (Validator()) {
      const customer = {
        id: values.id,
        name: values.name,
        sex: values.sex,
        telephone: values.telephone,
        email: values.email,
        cpf: values.cpf,
        cep: values.cep,
        streetAddress: values.streetAddress,
        addressNumber:
          values.addressNumber == null ? "" : values.addressNumber.toString(),
        addressComplement: values.addressComplement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        measureShoulder:
          values.measureShoulder == ""
            ? "0"
            : values.measureShoulder.toString(),
        measureLeftArm:
          values.measureLeftArm == "" ? "0" : values.measureLeftArm.toString(),
        measureRightArm:
          values.measureRightArm == ""
            ? "0"
            : values.measureRightArm.toString(),
        measureChest:
          values.measureChest == "" ? "0" : values.measureChest.toString(),
        measureWaist:
          values.measureWaist == "" ? "0" : values.measureWaist.toString(),
        measureNavelHeight:
          values.measureNavelHeight == ""
            ? "0"
            : values.measureNavelHeight.toString(),
        measureHip:
          values.measureHip == "" ? "0" : values.measureHip.toString(),
        measureLeftLeg:
          values.measureLeftLeg == "" ? "0" : values.measureLeftLeg.toString(),
        measureRightLeg:
          values.measureRightLeg == ""
            ? "0"
            : values.measureRightLeg.toString(),
        measureLeftCalf:
          values.measureLeftCalf == ""
            ? "0"
            : values.measureLeftCalf.toString(),
        measureRightCalf:
          values.measureRightCalf == ""
            ? "0"
            : values.measureRightCalf.toString(),
      };

      await api
        .put("/customer", customer)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);

            router.push("/customers");
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
    //Campos obrigatórios

    console.log(values);

    if (values.name == "" || values.email == "" || values.telephone == "") {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Favor preencher os campos obrigatórios");
      setOpenSnackbar(true);
      return false;
    } else return true;
  };
  return (
    <div className={"box new-edit"}>
      <h1>Editar Cliente</h1>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <FormControl
              sx={{ m: 4, width: 500 }}
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
            <FormControl sx={{ m: 4, width: 150 }} variant="standard">
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
            <FormControl sx={{ m: 4, width: 150 }} variant="filled">
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
            <FormControl
              sx={{ m: 4, width: 500 }}
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
            <FormControl
              sx={{ m: 4, width: 150 }}
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
          <div className={"formBox center"}>
            <Grid container>
              <Grid item xs={4} sx={{ mt: 15 }}>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureLeftArm">
                    Braço Esquerdo
                  </InputLabel>
                  <NumberFormat
                    id="measureLeftArm"
                    name="measureLeftArm"
                    value={values.measureLeftArm}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureLeftLeg">
                    Perna Esquerda
                  </InputLabel>
                  <NumberFormat
                    id="measureLeftLeg"
                    name="measureLeftLeg"
                    value={values.measureLeftLeg}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureLeftCalf">
                    Panturrilha Esquerda
                  </InputLabel>
                  <NumberFormat
                    id="measureLeftCalf"
                    name="measureLeftCalf"
                    value={values.measureLeftCalf}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureShoulder">Ombro</InputLabel>
                  <NumberFormat
                    id="measureShoulder"
                    name="measureShoulder"
                    value={values.measureShoulder}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureChest">Peito</InputLabel>
                  <NumberFormat
                    id="measureChest"
                    name="measureChest"
                    value={values.measureChest}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureNavelHeight">
                    Altura do umbigo
                  </InputLabel>
                  <NumberFormat
                    id="measureNavelHeight"
                    name="measureNavelHeight"
                    value={values.measureNavelHeight}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureWaist">Cintura</InputLabel>
                  <NumberFormat
                    id="measureWaist"
                    name="measureWaist"
                    value={values.measureWaist}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>

                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureHip">Quadril</InputLabel>
                  <NumberFormat
                    id="measureHip"
                    name="measureHip"
                    value={values.measureHip}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sx={{ mt: 15 }}>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureRightArm">
                    Braço Direito
                  </InputLabel>
                  <NumberFormat
                    id="measureRightArm"
                    name="measureRightArm"
                    value={values.measureRightArm}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureRightLeg">
                    Perna Direita
                  </InputLabel>
                  <NumberFormat
                    id="measureRightLeg"
                    name="measureRightLeg"
                    value={values.measureRightLeg}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
                <FormControl sx={{ m: 4, width: 300 }} variant="filled">
                  <InputLabel htmlFor="measureRightCalf">
                    Panturrilha Direita
                  </InputLabel>
                  <NumberFormat
                    id="measureRightCalf"
                    name="measureRightCalf"
                    value={values.measureRightCalf}
                    onChange={handleChange}
                    customInput={Input}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    format="#,##"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Put}>
              SALVAR
            </Button>
            <Link href="/customers">
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

export default withAuth(EditCustomer);
