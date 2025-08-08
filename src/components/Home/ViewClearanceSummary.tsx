import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { formateDate } from "../../services/datetime";
import TablePaginate, {
  type TableColumnsProps,
} from "../Generic/TablePaginate";
import { Delete, Edit } from "@mui/icons-material";
import ClearanceForm from "./ClearanceForm";
import { useState } from "react";
import { modalStyle } from "../Generic/DeleteModalConfirmation";

export default function ViewClearanceSummary() {
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

  const actionButtons = (props: any) => {
    return (
      <Stack direction={"row"}>
        <Button
          variant="outlined"
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
    </Box>
  );
}
