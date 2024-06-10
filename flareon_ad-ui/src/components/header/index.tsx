import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import * as React from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import { deepOrange, orange } from "@mui/material/colors";

type Page = {
  id: number;
  name: string;
  route: string;
  role: string;
  hasPermission: boolean;
};

function Header() {
  const cookies = parseCookies();
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [initialLetter, setInitialLetter] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => {
    if (cookies.user !== undefined) {
      setInitialLetter(cookies.user.replaceAll('"', "").charAt(0));
    }
    if (cookies.role !== undefined) {
      setRoleName(cookies.role.replaceAll('"', ""));
      let pagesTemp: Page[] = [
        {
          id: 1,
          name: "Home",
          route: "/",
          hasPermission: false,
          role: "Usuario Administrativo",
        },
        {
          id: 2,
          name: "Produtos",
          route: "/products",
          hasPermission: false,
          role: "Usuario Administrativo",
        },
        {
          id: 3,
          name: "Clientes",
          route: "/customers",
          hasPermission: false,
          role: "Usuario Administrativo",
        },
        {
          id: 5,
          name: "Comandas",
          route: "/orders",
          hasPermission: false,
          role: "Usuario Administrativo",
        },
        {
          id: 6,
          name: "Vendas",
          route: "/sales",
          hasPermission: false,
          role: "Usuario Administrativo",
        },
        {
          id: 7,
          name: "Funcionários",
          route: "/employes",
          hasPermission: false,
          role: "Administrador",
        },
        {
          id: 8,
          name: "Usuários",
          route: "/users",
          hasPermission: false,
          role: "Administrador",
        },
        {
          id: 9,
          name: "Relatórios",
          route: "/reports",
          hasPermission: false,
          role: "Administrador",
        },
      ];

      const pagesWithPermission = pagesTemp.map((page) => {
        if (
          cookies.role.replaceAll('"', "") === "Usuario Administrativo" &&
          page.role == cookies.role.replaceAll('"', "")
        ) {
          page.hasPermission = true;
        } else page.hasPermission = false;

        if (cookies.role.replaceAll('"', "") === "Administrador")
          page.hasPermission = true;
          
        return page;
      });
      setPages(pagesWithPermission);
    }
  }, [cookies.user, cookies.role]);

  if (router.pathname === "/login") return null;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const DoLogout = () => {
    setAnchorElUser(null);
    destroyCookie(null, "idUser");
    destroyCookie(null, "user");
    destroyCookie(null, "role");
    destroyCookie(null, "token");

    router.push("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src="/LOGO-FLAREONAD.png" className={styles.logo} alt="" />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link href={page.route} key={page.route}>
                  <Typography
                    fontWeight={"bold"}
                    textAlign="center"
                    color={"#CA8114"}
                  >
                    {page.name}
                  </Typography>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          ></Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) =>
              page.hasPermission === true ? (
                <Link href={page.route} key={page.route}>
                  <Button
                    sx={{
                      my: 2,
                      color: "#CA8114",
                      display: "block",
                      fontWeight: "bold",
                    }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ) : null
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                  {initialLetter}{" "}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link href={"/profile"}>
                <MenuItem>
                  <Typography textAlign="center">Perfil</Typography>
                </MenuItem>
              </Link>
              <MenuItem onClick={DoLogout}>
                <Typography textAlign="center">Sair</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
