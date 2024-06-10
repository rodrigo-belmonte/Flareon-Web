/* eslint-disable */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MutableRefObject, PureComponent, ReactInstance, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { api } from "../../../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OrderVm } from "../../../types/Order/tpOrderVm";

type PrintDialogProps = {
  _order: OrderVm;
  _openDialog: boolean;
  _dtOrder: string;
  _dtWithdrawal: Date;
  _dtCompletion: Date;
};

function PrintDialog({
  _order,
  _openDialog,
  _dtOrder,
  _dtWithdrawal,
  _dtCompletion,
}: PrintDialogProps) {
  let componentCustomerRef = useRef(null);
  let componentAteliêRef = useRef(null);
  let componentPieceRef = useRef(null);
  const [order, setOrder] = useState({
    id: "",
    orderNumber: "",
    customer: {
      id: "",
      name: "",
      address: "",
      neighborhood: "",
      email: "",
      telephone: "",
    },
    employeeName: "",
    production: true,
    pieces: [],
    totalValue: 0,
    dtOrder: "",
    dtWithdrawal: "",
    dtCompletion: ""
  });
  const [pieceToPrint, setPieceToPrint] = useState({
    id: "",
    name: "",
    description: "",
    products: [],
    total: "",
  });
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    setOrder({
      id: _order.id,
      orderNumber: _order.orderNumber,
      customer: {
        id: _order.customer.id,
        name: _order.customer.name,
        address: "",
        neighborhood: "",
        email: "",
        telephone: "",
      },
      employeeName: _order.employee.name,
      dtOrder: _dtOrder,
      dtWithdrawal: format(_dtWithdrawal, "dd/MM/yyyy", {
        locale: ptBR,
      }),
      pieces: _order.pieces,
      totalValue: _order.totalValue.toFixed(2).toString().replace(".", ","),
      production: _order.production,
      dtCompletion: format(_dtCompletion, "dd/MM/yyyy", {
        locale: ptBR,
      }),
    });
  }, [_order, _dtOrder, _dtWithdrawal, _dtCompletion]);

  useEffect(() => {
    if (order.customer.id != "") {

      if (order.customer.address == "") {
        const url = `/customer/${order.customer.id}`;

        api.get(url).then((response) => {
          if (response.data.success == true) {
            setOrder({
              ...order,
              customer: {
                id: response.data.customer.id,
                name: response.data.customer.name,
                address: `${response.data.customer.streetAddress}, ${
                  response.data.customer.addressNumber
                } ${
                  response.data.customer.addressComplement == null
                    ? ""
                    : response.data.customer.addressComplement
                }`,
                neighborhood: response.data.customer.neighborhood,
                email: response.data.customer.email,
                telephone: response.data.customer.telephone,
              },
            });
          }
        });
      }
    }
  }, [order]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    setOpenDialog(_openDialog);
  }, [_openDialog]);

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setPieceToPrint(
        order.pieces.filter((piece) => {
          return piece.id === panel;
        })[0]
      );
      setExpanded(isExpanded ? panel : false);
    };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const reactToPrintCustomer = useCallback(() => {
    return componentCustomerRef.current;
  }, [componentCustomerRef.current]);

  const reactToPrintAtelie = useCallback(() => {
    return componentAteliêRef.current;
  }, [componentAteliêRef.current]);

  const reactToPrintPiece = useCallback(() => {
    return componentPieceRef.current;
  }, [componentPieceRef.current]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Comanda #{order.orderNumber}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Cliente: {order.customer.name}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Funcionário: {order.employeeName}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Peças: {order.pieces.length}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Valor Total: R${order.totalValue}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Data Comanda: {order.dtOrder}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Data Finalização: {order.dtCompletion}
          </Typography>
          <Typography sx={{ fontSize: 15 }} component="p" variant="caption">
            Data Retirada: {order.dtWithdrawal}
          </Typography>
          <Typography sx={{ m: 2 }} component="p" variant="h6">
            Peças
          </Typography>
          {order.pieces.map((piece) => {
            return (
              <Accordion
                square
                expanded={expanded === piece.id}
                onChange={handleChangeAccordion(piece.id)}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    {piece.name}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {piece.description}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ReactToPrint
                    trigger={() => (
                      <Button variant="contained" color="primary">
                        Imprimir Peça
                      </Button>
                    )}
                    content={reactToPrintPiece}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="primary">
              Imprimir Via Ateliê
            </Button>
          )}
          content={reactToPrintAtelie}
        />
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="primary">
              Imprimir Via Cliente
            </Button>
          )}
          content={reactToPrintCustomer}
        />
      </DialogActions>
      <div style={{ display: "none" }}>
        <CustomerPrint
          ref={componentCustomerRef}
          order={order}
        />
        <AteliePrint ref={componentAteliêRef} order={order} />
        <PiecePrint
          ref={componentPieceRef}
          piece={pieceToPrint}
          orderNumber={order.orderNumber}
        />
      </div>
    </Dialog>
  );
}

class CustomerPrint extends PureComponent<any> {

  render() {
    const { order } = this.props;

    return (
      <Box sx={{ mr: 5, ml: 2 }}>
        <div>
        <Typography
            sx={{ mt: 2, fontSize: 8, fontWeight: "bold", mb:2 }}
            align="center"
            component="h1"
            variant="h6"
          >
            Via Cliente
          </Typography>
          <Typography
            sx={{ mt: 2, fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h1"
            variant="h6"
          >
            Ateliê de Costura Elyzeth
          </Typography>
          <Typography
            sx={{ fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h2"
            variant="caption"
          >
            Roupas em Geral - Masculino e Feminino
          </Typography>
          <Typography
            sx={{ fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h2"
            variant="caption"
          >
            Reformas, Transforma, Conserta, Ajusta
          </Typography>
          <Typography
            sx={{ fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h2"
            variant="caption"
          >
            Rua Maria Amália Lopes de Azevedo, 570
          </Typography>
          <Typography
            sx={{ mb: 1, fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h2"
            variant="caption"
          >
            Bairro Tremembé
          </Typography>
          <Typography
            sx={{ fontSize: 10, fontWeight: "bold" }}
            align="center"
            component="h2"
            variant="caption"
          >
            2952-5090 / 98941-6179
          </Typography>
        </div>
        <>-------------------</>
        <div>
          <Typography sx={{ fontSize: 20, fontWeight: "bold",  }}  align="center" component="p" variant="caption">
            <b>#{order.orderNumber}</b>
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Cliente: {order.customer.name}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Peças: {order.pieces.length}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Valor: R${order.totalValue}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Entrada: {order.dtOrder}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Retirada: {order.dtWithdrawal}
          </Typography>
        </div>
        <>-------------------</>
        <Typography sx={{ fontSize: 10, fontWeight: "bold" }} component="p" variant="caption">
         Nota: Roupas não retiradas no prazo de 30 dias da data de
          entrega terão reajuste no preço. As mesmas poderão ser vendidas para
          pagamento das respectivas despesas.
        </Typography>
      </Box>
    );
  }
}

class AteliePrint extends PureComponent<any>  {
  
  render() {
    const { order } = this.props;
    return (
      <Box sx={{ mr: 5, ml: 2 }}>
        <div>
        <Typography
            sx={{ mt: 2, fontSize: 8, fontWeight: "bold", mb:2 }}
            align="center"
            component="h1"
            variant="h6"
          >
            Via Estabelecimento
          </Typography>
          <Typography
            sx={{ mt: 2, mb: 2, fontSize: 12, fontWeight: "bold" }}
            align="center"
            component="h1"
            variant="h6"
          >
            Ateliê de Costura Elyzeth
          </Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}  align="center" component="p" variant="caption">
            <b>#{order.orderNumber}</b>
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Cliente: {order.customer.name}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Bairro: {order.customer.neighborhood}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Tel: {order.customer.telephone}
          </Typography>
          <>-------------------</>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Entrada: {order.dtOrder}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Retirada: {order.dtCompletion}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Qtde: {order.pieces.length}
          </Typography>
        </div>
        <>-------------------</>
        <Typography
          sx={{ mb: 2, fontSize: 12, fontWeight: "bold" }}
          align="center"
          component="h2"
          variant="caption"
        >
          Observações Complementares
        </Typography>
        {order.pieces.map((piece) => {
          return (
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
                Peça: {piece.name}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
                Descrição: {piece.description}
              </Typography>
              {piece.products.map((prod) => {
                return (
                  <Box>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: "bold" }}
                      component="p"
                      variant="caption"
                    >
                      {prod.name} - qtde: {prod.quantity}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: "bold" }}
                      component="p"
                      variant="caption"
                    >
                      obs: {prod.obs}
                    </Typography>
                  </Box>
                );
              })}
              <>-------------------</>
            </Box>
          );
        })}
      </Box>
    );
  }
}

class PiecePrint extends PureComponent<any>  {
 

  render() {
    const { piece, orderNumber } = this.props;
    return (
      <Box sx={{ mr: 5, ml: 2 }}>
        <div>
          <Typography
            sx={{ mt: 2, mb: 2, fontSize: 12, fontWeight: "bold" }}
            align="center"
            component="h1"
            variant="h6"
          >
            Ateliê de Costura Elyzeth
          </Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 20, mb:2, fontWeight: "bold" }}  align="center" component="p" variant="caption">
            <b>#{orderNumber}</b>
          </Typography>
          
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Peça: {piece.name}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }} component="p" variant="caption">
            Descrição: {piece.description}
          </Typography>
          <>-------------------</>
          {piece.products.map((prod) => {
            return (
              <Box>
                <Typography
                  sx={{ fontSize: 12, fontWeight: "bold" }}
                  component="p"
                  variant="caption"
                >
                  {prod.name} - qtde: {prod.quantity}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: "bold" }}
                  component="p"
                  variant="caption"
                >
                  obs: {prod.obs}
                </Typography>
                <>-------------------</>
              </Box>
            );
          })}
        </div>
      </Box>
    );
  }
}

export default PrintDialog;
