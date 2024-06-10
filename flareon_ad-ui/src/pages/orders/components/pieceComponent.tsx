import {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Snackbar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  AlertColor,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { PieceClothing } from "../../../types/Order/tpPieceClothing";
import { ProductSelect } from "../../../types/Products/tpProductSelect";
import { SelectedProductVm } from "../../../types/Products/tpSelectedProductVm";

type PieceProps = {
  _piece: PieceClothing;
  _productsName: string[];
  _products: ProductSelect[];
  _onChange: any;
  _readOnly: boolean;
};

function PieceComponent({
  _piece,
  _products,
  _productsName,
  _onChange,
  _readOnly = false,
}: PieceProps) {
  const [piece, setPiece] = useState<PieceClothing>({
    id: "",
    description: "",
    name: "",
    products: [],
    total: 0,
    action: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductVm[]>(
    []
  );
  const [products, setProducts] = useState<ProductSelect[]>(
    []
  );
  const [productsName, setProductsName] = useState<string[]>(
    []
  );
  const [prodToRemove, setProdToRemove] = useState();
  const [prodToUpdate, setProdToUpdate] = useState();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", hide: true },
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "price",
      headerName: "Preço",
      width: 100,
      valueParser: (params) => Number(params.newValue),
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },
    {
      field: "quantity",
      headerName: "Qtde",
      width: 70,
      editable: !_readOnly,
      cellStyle: { "background-color": "white", border: "ridge" },
      valueParser: (params) => Number(params.newValue),
      valueSetter: (params) => {
        params.data.quantity = params.newValue;
        params.data.total = params.data.price * params.data.quantity;
        setProdToUpdate(params.data);
        return true;
      },
    },
    {
      field: "obs",
      headerName: "Observação",
      flex: 1,
      editable: !_readOnly,
      cellStyle: { "background-color": "white", border: "ridge" },
      valueSetter: (params) => {
        params.data.obs = params.newValue;
        setProdToUpdate(params.data);
        return true;
      },
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      valueGetter: (params) => params.data.price * params.data.quantity,
      valueParser: (params) => Number(params.newValue),
      valueFormatter: (params) =>
        "R$" + params.value.toFixed(2).toString().replace(".", ","),
    },

    {
      field: "options",
      headerName: "",
      cellRenderer: (params) => {
        const rowSelected = params.data;
        return (
          <div>
            <Button onClick={() => setProdToRemove(rowSelected)}>
              <DeleteIcon />
            </Button>
          </div>
        );
      },
      floatingFilter: false,
      width: 60,
    },
  ]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [pieceLoaded, setPieceLoaded] = useState<boolean>(false);

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleChangeSelectProduct = (
    event: SelectChangeEvent<typeof _productsName>
  ) => {
    const selectedProds = piece.products;

    const {
      target: { value },
    } = event;
    let prodAlreadyExists = piece.products.find((p) => {
      return p.id == value;
    });
    if (prodAlreadyExists) {
      //   props.ProdAlreadyInserted;
    } else {
      let prod = Object.assign(
        {},
        _products.find((p) => {
          return p.id == value;
        })
      );
      let prodToAdd: SelectedProductVm = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        obs: "",
        total: prod.price,
      };
      selectedProds.push(prodToAdd);
      setSelectedProducts((current) => [...current, prodToAdd]);
      setPiece({ ...piece, products: selectedProds });
    }
  };

  useEffect(() => {
    setProductsName(_productsName)
  }, [_productsName]);

  useEffect(() => {
    setProducts(_products)
  }, [_products]);
  
  useEffect(() => {
    setPiece({
      id: _piece.id,
      description: _piece.description,
      name: _piece.name,
      products: _piece.products,
      total: _piece.total,
      action: "",
    });
    setSelectedProducts(_piece.products);
    setPieceLoaded(true);
  }, [_piece]);
  useEffect(() => {
    const handleDeleteProd = (prod) => {
      var filtered = selectedProducts.filter(function (value, index, arr) {
        return value.id != prod.id;
      });
      setSelectedProducts(filtered);
      setProdToRemove(null);
      setPiece({
        ...piece,
        products: filtered,
      });
    };

    const handleUpdateProd = (product) => {
      const newState = selectedProducts.map((prod) => {
        if (prod.id === product.id) {
          return {
            ...prod,
            quantity: product.quantity,
            total: product.total,
            obs: product.obs,
          };
        }
        return prod;
      });

      setSelectedProducts(newState);
      setProdToUpdate(null);
      setPiece({
        ...piece,
        products: newState,
      });
    };

    if (prodToRemove != null) handleDeleteProd(prodToRemove);
    if (prodToUpdate != null) handleUpdateProd(prodToUpdate);
  }, [selectedProducts, prodToRemove, prodToUpdate, piece]);

  useEffect(() => {
    if (pieceLoaded) {
      setSelectedProducts(piece.products);
      let prices = piece.products.map((p) => p.total);
      if (prices.length > 0) {
        const sum = prices.reduce((a, b) => a + b);
        if (piece.total != sum) {
          setPiece({
            ...piece,
            total: sum,
          });
        }
      } else {
        if (piece.total != 0) {
          setPiece({
            ...piece,
            total: 0,
          });
        }
      }
    }

    _onChange(piece);
  }, [piece]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPiece({
      ...piece,
      [event.target.name]: event.target.value,
    });
  };

  const DeletePiece = () => {
    setPiece({
      ...piece,
      action: "delete",
    });
    _onChange(piece);
  };

  return (
    <Grid container sx={{ borderBottom: "solid 1px" }}>
      <Grid
        item
        justifyContent="center"
        xs={1}
        sx={{ padding: "0 !important" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            alignContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Button
            color="error"
            sx={{ height: "100%", width: "100%" }}
            onClick={DeletePiece}
            disabled={_readOnly}
          >
            <DeleteIcon />
          </Button>
        </Box>
      </Grid>
      <Grid item xs={11} sx={{ padding: "0 !important" }}>
        <Accordion
          square
          expanded={expanded === "panel1"}
          onChange={handleChangeAccordion("panel1")}
          disableGutters
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {piece.name}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Valor Total da Peça: R$
              {piece.total.toFixed(2).toString().replace(".", ",")}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <div className={"formBox"}>
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <div className={"inputBox"}>
                    <FormControl
                      sx={{ mb: 5, mr: 1, ml: 1 }}
                      fullWidth
                      variant="standard"
                    >
                      <InputLabel htmlFor="name">Nome da Peça</InputLabel>
                      <Input
                        id="name"
                        name="name"
                        value={piece.name}
                        onChange={handleChange}
                        disabled={_readOnly}
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={"inputBox"}>
                    <FormControl
                      sx={{ mb: 5, mr: 1, ml: 1 }}
                      fullWidth
                      variant="standard"
                    >
                      <InputLabel htmlFor="description">
                        Descrição da Peça
                      </InputLabel>
                      <Input
                        id="description"
                        name="description"
                        value={piece.description}
                        onChange={handleChange}
                        disabled={_readOnly}
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={"inputBox"}>
                    <FormControl
                      sx={{ mb: 5, mr: 1, ml: 1, width: "50%" }}
                      variant="standard"
                    >
                      <InputLabel htmlFor="ProductId">
                        Selecionar Produtos
                      </InputLabel>
                      <Select
                        labelId="productId"
                        id="productId"
                        multiple
                        value={productsName}
                        onChange={handleChangeSelectProduct}
                        placeholder="Selecione"
                        disabled={_readOnly}
                      >
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ mt: 2, mb: 5, fontWeight: "bold" }}
                    variant="h5"
                    component="p"
                  >
                    Valor Total da Peça : R${" "}
                    {piece.total.toFixed(2).toString().replace(".", ",")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <div
                    className="ag-theme-alpine"
                    style={{ height: "40vh", width: "100%" }}
                  >
                    <AgGridReact
                      rowData={selectedProducts}
                      columnDefs={columnDefs}
                      defaultColDef={{
                        resizable: true,
                      }}
                    ></AgGridReact>
                  </div>
                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}

export default PieceComponent;
