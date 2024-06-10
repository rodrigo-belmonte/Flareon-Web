import Head from "next/head";
import Image from "next/image";

import { Container, Grid } from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SwitchAccountRoundedIcon from "@mui/icons-material/SwitchAccountRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReceiptIcon from "@mui/icons-material/Receipt";

import styles from "./home.module.scss";
import Link from "next/link";

import { useRouter } from "next/router";
import nookies, { parseCookies } from "nookies";
import withAuth from "../components/PrivateRoute/withAuth";
import { useEffect, useState } from "react";
import { ro } from "date-fns/locale";

function Home() {
  const cookies = parseCookies();
  const [hiddenMenu, setHiddenMenu] = useState<boolean>(true);

  useEffect(() => {
    if (cookies.role !== undefined) {
      cookies.role.replaceAll('"', "") === "Usuario Administrativo"
        ? setHiddenMenu(true)
        : setHiddenMenu(false);
    }
  }, []);

  return (
    <div className={styles.home}>
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={4}>
          <Link href="/customers">
            <a>
              <div className={styles.itemMenuGrid}>
                <PeopleRoundedIcon />
                <h2>Clientes</h2>
              </div>
            </a>
          </Link>
        </Grid>
        <Grid item xs={4}>
          <Link href="/orders">
            <a>
              <div className={styles.itemMenuGrid}>
                <ReceiptIcon />
                <h2>Comandas</h2>
              </div>
            </a>
          </Link>
        </Grid>
        <Grid item xs={4}>
          <Link href="/sales">
            <a>
              <div className={styles.itemMenuGrid}>
                <ShoppingCartRoundedIcon />
                <h2>Vendas</h2>
              </div>
            </a>
          </Link>
        </Grid>
        <Grid item xs={4}>
          <Link href="/products">
            <a>
              <div className={styles.itemMenuGrid}>
                <Inventory2RoundedIcon />
                <h2>Produtos</h2>
              </div>
            </a>
          </Link>
        </Grid>
        {hiddenMenu === false ? (
          <>
           <Grid item xs={4}>
              <Link href="/employes">
                <a>
                  <div className={styles.itemMenuGrid}>
                    <SwitchAccountRoundedIcon />
                    <h2>Funcionários</h2>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Link href="/users">
                <a>
                  <div className={styles.itemMenuGrid}>
                    <SwitchAccountRoundedIcon />
                    <h2>Usuários</h2>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Link href="/reports">
                <a>
                  <div className={styles.itemMenuGrid}>
                    <DashboardRoundedIcon />
                    <h2>Relatórios Gerenciais</h2>
                  </div>
                </a>
              </Link>
            </Grid>
          </>
        ) : null}
      </Grid>
    </div>
  );
}

export default withAuth(Home);

