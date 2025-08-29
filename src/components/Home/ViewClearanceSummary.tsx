import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { formateDate } from "../../services/datetime";
import TablePaginate, {
  type TableColumnsProps,
} from "../Generic/TablePaginate";
import { Edit } from "@mui/icons-material";
import ClearanceForm from "./ClearanceForm";
import { useState } from "react";
import { modalStyle } from "../Generic/DeleteModalConfirmation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { type FormikValues } from "formik";
import PrintableReceipt from "./PrintableReceipt";

const ViewClearanceSummary = () => {
  const columns: TableColumnsProps[] = [
    { label: "Date", field: "date", minWidth: 150 },
    { label: "Name", field: "name", minWidth: 250 },
    { label: "Age", field: "age", minWidth: 80 },
    { label: "Sex", field: "sex", minWidth: 80 },
    { label: "Amount(PhP)", field: "amount", minWidth: 150 },
    {
      label: "Created By",
      field: "created_by?.name",
      isNested: true,
      minWidth: 100,
    },
    {
      label: "Created Date",
      field: "created_at",
      minWidth: 200,
      format: (value: any) => formateDate(value),
    },
    {
      label: "Updated By",
      field: "updated_by?.name",
      isNested: true,
      minWidth: 150,
    },
    {
      label: "Updated Date",
      field: "updated_at",
      minWidth: 200,
      format: (value: any) => formateDate(value),
    },
  ];

  const model = {
    name: "doctors",
    route: "/clearance",
    labelSingular: "record",
  };

  const apiUrl = "/clearance";

  const DeleteWarningMessage = () => {
    return (
      <>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          textAlign={"left"}
        >
          This action <span style={{ fontWeight: "bold" }}>CANNOT</span> be
          undone. This will remove the record from the summary page and can
          never be retrieved.
        </Typography>
      </>
    );
  };

  const [openCLDialog, setOpenCFDialog] = useState(false);

  const closeCLForm = () => {
    setOpenCFDialog(false);
  };

  const [selectedItem, setSelectedItem] = useState<any>({});
  const [openViewClearance, setOPenViewClearance] = useState<boolean>(false);

  const actionButtons = (props: any) => {
    return (
      <Stack direction={"row"}>
        <IconButton
          aria-label="view"
          onClick={() => {
            console.log("props,---", props);
            setSelectedItem(props);
            setOPenViewClearance(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedItem(props);
            setOpenCFDialog(true);
          }}
          sx={{ margin: 1 }}
          startIcon={<Edit />}
        >
          Edit
        </Button>
      </Stack>
    );
  };

  interface ClearanceFormDialog {
    open: boolean;
    onClose: () => void;
    formValues: any;
    setReload?: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const ClearanceFormDialog = ({
    open,
    onClose,
    formValues,
    setReload,
  }: ClearanceFormDialog) => {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <ClearanceForm
            item={formValues}
            closeCFDialog={onClose}
            setReload={setReload}
          />
        </Box>
      </Modal>
    );
  };

  const [reload, setReload] = useState<boolean>(false);

  return (
    <Box>
      <ClearanceFormDialog
        open={openCLDialog}
        onClose={closeCLForm}
        formValues={selectedItem}
        setReload={setReload}
      />
      <TablePaginate
        model={model}
        columns={columns}
        itemsPerPageOptions={[10, 25, 50]}
        itemsPerPageDefault={10}
        apiUrl={apiUrl}
        primaryKey="clearance"
        exportable={true}
        actionButtons={actionButtons}
        reload={reload}
      >
        <DeleteWarningMessage />
      </TablePaginate>
      <OpenViewClearance
        open={openViewClearance}
        onClose={() => setOPenViewClearance(false)}
        formValues={selectedItem}
      />
    </Box>
  );
};

interface OpenViewClearanceProps {
  open: boolean;
  onClose: () => void;
  formValues: FormikValues;
}

const OpenViewClearance = ({
  open,
  onClose,
  formValues,
}: OpenViewClearanceProps) => {
  const modalStyle = {
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
      onClose={() => {
        console.log("onn close");
        onClose();
      }}
    >
      <Box sx={modalStyle} justifyContent={"center"}>
        <PrintableReceipt formValues={formValues} onClose={() => onClose()} />
      </Box>
    </Modal>
  );
};

export default ViewClearanceSummary;
