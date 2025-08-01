import { observer } from "mobx-react";
import { Alert, Snackbar, type SnackbarOrigin } from "@mui/material";
import { useState } from "react";
import { userStore } from "../../stores/userstore";

interface State extends SnackbarOrigin {
  open?: boolean;
}

const SnackBar = observer(() => {
  const store = userStore;

  const handleClose = () => {
    store.setSnackBar({ ...store.snackBar, open: false });
  };

  const [state, _] = useState<State>({
    vertical: "bottom",
    horizontal: "left",
  });

  const { vertical, horizontal } = state;

  return (
    <Snackbar
      open={userStore.snackBar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
    >
      <Alert {...userStore.snackBar.alert}>{store.snackBar.message}</Alert>
    </Snackbar>
  );
});

export default SnackBar;
