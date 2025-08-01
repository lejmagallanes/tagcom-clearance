import { Box } from "@mui/material";
import type { ReactNode } from "react";
import SnackBar from "./Snackbar";
import { observer } from "mobx-react-lite";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box className="page-wrapper">
      {children}
      <SnackBar />
    </Box>
  );
};

export default observer(Layout);
