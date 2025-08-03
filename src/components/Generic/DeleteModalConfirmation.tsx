import { Box, Modal, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface DeleteModalConfirmationProps {
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: () => void;
  handleClose: () => void;
  model: any;
  selectedItem: any;
}

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  borderRadius: "1em",
};

const DeleteModalConfirmation = ({
  children,
  open,
  handleClose,
  model,
  selectedItem,
}: DeleteModalConfirmationProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          mb={3}
          textAlign={"center"}
        >
          Delete {model.labelSingular}?
        </Typography>
        <Typography>
          Are you sure you want to delete{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedItem?.name ?? `this record`}
          </span>
          ?
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default DeleteModalConfirmation;
