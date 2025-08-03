import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
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
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          // minHeight: "calc(100vh - 64px)", // subtract AppBar height
          // flex: 1,
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        <div style={{ height: "2000px" }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
});

export default DefaultLayout;
