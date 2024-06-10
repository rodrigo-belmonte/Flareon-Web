/* eslint-disable react/jsx-key */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SelectedProductVm } from "../../../types/Products/tpSelectedProductVm";
import { OrderSale } from "../../../types/Sale/tpOrderSale";
import { PieceSale } from "../../../types/Sale/tpPieceSale";

type OrderComponentProps = {
  _order: OrderSale;
};

type PieceCardProps = {
  _piece: PieceSale;
};

type ProductItemListProps = {
  _product: SelectedProductVm;
};

function OrderComponent({ _order }: OrderComponentProps) {
  const [order, setOrder] = useState<OrderSale>({
    CustomerName: "",
    DtCompletion: "",
    DtOrder: "",
    DtWithdrawal: "",
    EmployeeName: "",
    Id: "",
    OrderNumber: 0,
    Pieces: [],
    TotalValue: 0
  })

  useEffect(() => {
    setOrder({
      CustomerName: _order.CustomerName,
    DtCompletion: _order.DtCompletion,
    DtOrder: _order.DtOrder,
    DtWithdrawal: _order.DtWithdrawal,
    EmployeeName: _order.EmployeeName,
    Id: _order.Id,
    OrderNumber: _order.OrderNumber,
    Pieces: _order.Pieces,
    TotalValue: _order.TotalValue
    })
  }, [_order]);

  return (
    <div className={"formBox"}>
      <Typography
        sx={{ p: 2, fontWeight: "bold" }}
        variant="h5"
        component="div"
      >
        <>Comanda #{order.OrderNumber}</>
      </Typography>
      <Grid container sx={{ p: 2 }}>
        <Grid item xs={2} sx={{ mt: 1, fontWeight: "bold" }}>
          <div>
            <span>Cliente: {order.CustomerName}</span>
            <br />
            <span>Funcionário: {order.EmployeeName}</span>
            <br />
            <span>Data da Comanda: {order.DtOrder}</span>
          </div>
          <Typography
            sx={{ mt: 2, fontWeight: "bold" }}
            variant="subtitle1"
            component="div"
          >
            <>Valor Comanda : R$ {order.TotalValue.toFixed(2).toString().replace(".", ",")}</>
          </Typography>
        </Grid>

        <Grid item xs={10}>
          <Typography
            sx={{ mb: 2, fontWeight: "bold" }}
            variant="h4"
            component="div"
          >
            Peças
          </Typography>
            {order.Pieces.map((piece) => (
              <PieceCard _piece={piece} />
            ))}
        </Grid>
      </Grid>
    </div>
  );
}

function PieceCard({ _piece }: PieceCardProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
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
        <Typography variant="h5"
            component="div" sx={{ width: "33%", flexShrink: 0 }}>
          {_piece.name}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Valor Total da Peça: R${_piece.total.toFixed(2).toString().replace(".", ",")}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
      <Typography variant="h6"
            component="div" >
          Produtos
        </Typography>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          {_piece.products.map((prod) => (
            <ProductItemList _product={prod} />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

function ProductItemList({ _product }: ProductItemListProps) {
  const [secondaryText, setSecondaryText] = useState<string>(
    "Qtd: " + _product.quantity + "| Total: R$" + _product.total.toFixed(2).toString().replace(".", ",")
  );

  return (
    <ListItem>
      <ListItemText primary={_product.name} secondary={secondaryText} />
    </ListItem>
  );
}

export default OrderComponent;
