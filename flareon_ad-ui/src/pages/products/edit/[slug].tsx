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
  AlertColor,
} from "@mui/material";
import { api } from "../../../services/api";
import { useRouter } from "next/router";
import withAuth from "../../../components/PrivateRoute/withAuth";
import NumberFormat from "react-number-format";
import Link from "next/link";
import { AxiosError } from "axios";

type Product = {
  id: string;
  name: string;
  price: string;
};

function EditProduct() {
  const router = useRouter();
  const id = router.query.slug;
  const [values, setValues] = useState<Product>({
    id: "",
    name: "",
    price: "",
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
    const url = `/product/${id}`;
    console.log(url);
    api
      .get(url)
      .then((response) => {
        if (response.data.success == true) {
          const resProduct: Product = {
            id: response.data.product.id,
            name: response.data.product.name,
            price: response.data.product.price,
          };

          setValues(resProduct);
        }
      })
      .catch((error: AxiosError) => {
        setSeveritySnackbar("error");
        setSnackBarTitle("Erro ao Salvar:");
        setSnackBarMessage(error.message);
        setOpenSnackbar(true);
      });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const Put = async() => {
    if (Validator()) {
      const product = {
        id: values.id,
        name: values.name,
        price: values.price,
      };

      await api
        .put("/product", product)
        .then((response) => {
          if (response.data.success === true) {
            setSeveritySnackbar("success");
            setSnackBarTitle("Salvo com SUcesso!");
            setSnackBarMessage("");
            setOpenSnackbar(true);
            router.push("/products");
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

    if (values.name == "" || values.price == "") {
      setSeveritySnackbar("warning");
      setSnackBarTitle("Atenção:");
      setSnackBarMessage("Favor preencher os campos obrigatórios.");
      setOpenSnackbar(true);
      return false;
    } else return true;
  };
  return (
    <div>
      <h1>Editar Produto</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={"formBox"}>
            <FormControl sx={{ m: 5, width: 300 }} variant="filled" required
              error={values.name == ""}>
              <InputLabel htmlFor="productName">Nome</InputLabel>
              <Input
                id="productName"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ m: 5, width: 150 }} variant="filled" required
              error={values.price == ""}>
              <InputLabel htmlFor="productPrice">Preço</InputLabel>
              <NumberFormat
                id="productPrice"
                name="price"
                value={values.price}
                onChange={handleChange}
                customInput={Input}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
              />
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={"buttonBox"}>
            <Button variant="contained" color="success" onClick={Put}>
              SALVAR
            </Button>
            <Link href="/products">
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

export default withAuth(EditProduct);
