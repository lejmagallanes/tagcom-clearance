import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "../../auth/useAuth";
import { userStore } from "../../stores/userstore";
import axiosClient from "../../services/axiosClient";

const DefaultLayout = observer(() => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const { setUser, setToken } = userStore;

  const token = localStorage.getItem("ACCESS_TOKEN");
  const navigate = useNavigate();

  const auth = localStorage.getItem("user");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    axiosClient.post("/logout").then(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
      localStorage.clear();
    });
  };

  React.useEffect(() => {
    if (token) {
      axios.get("/user").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          {auth && (
            <>
              <Box flex={1}>
                <Typography variant="h6" color="primary" textAlign={"left"}>
                  Welcome!
                </Typography>
              </Box>
              <Box flex={1}>
                <Grid container>
                  <Grid
                    size={12}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flex={1}
                  >
                    <img src="/tagcom_logo.png" width={350} />
                  </Grid>
                </Grid>
              </Box>
              <Box flex={1} textAlign={"right"}>
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="primary"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem disabled>Hi, {auth}</MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        <div style={{ height: "2000px" }}>
          <Outlet />
          <Footer />
        </div>
      </Box>
    </Box>
  );
});

const Footer = () => {
  const StyledFooter = styled("footer", {
    shouldForwardProp: (prop) => prop !== "primary",
  })<any>(() => ({
    ".footer": {
      backgroundCcolor: "#f5f5f5" /* Light gray background */,
      color: "#333" /* Dark text */,
      textAlign: "center" /* Centered text */,
      padding: "1rem" /* Space inside */,
      position: "fixed" /* Stays at bottom */,
      bottom: "0",
      left: "0",
      width: "100%" /* Full width */,
      borderTop: "1px solid #ddd" /* Subtle top border */,
    },
  }));

  return (
    <StyledFooter className="footer">
      <p>
        © {new Date().getFullYear()} MagMa Solutions. All rights reserved. |
        Version {import.meta.env.VITE_APP_VERSION}
      </p>
    </StyledFooter>
  );
};

export default DefaultLayout;
