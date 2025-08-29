import { Box, Modal } from "@mui/material";
import type { FormikProps, FormikValues } from "formik";
import PrintableReceipt from "./PrintableReceipt";

interface ClearanceDialogProps {
  open: boolean;
  onClose: () => void;
  formValues: FormikValues;
  formik: FormikProps<FormikValues>;
}

const OpenClearanceContent = ({
  open,
  onClose,
  formValues,
  formik,
}: ClearanceDialogProps) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
    height: "80vh",
    width: "auto",
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} justifyContent={"center"}>
        <PrintableReceipt
          formValues={formValues}
          formik={formik}
          onClose={onClose}
        />
      </Box>
    </Modal>
  );
};

export default OpenClearanceContent;
