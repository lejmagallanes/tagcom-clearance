import { Box, Button, Typography } from "@mui/material";
import { formateDate } from "../../services/datetime";
import TablePaginate, {
  type TableColumnsProps,
} from "../Generic/TablePaginate";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";

export default function ViewClearanceSummary() {
  const columns: TableColumnsProps[] = [
    { label: "Date", field: "date", minWidth: 150 },
    { label: "Name", field: "name", minWidth: 250 },
    { label: "Age", field: "age", minWidth: 80 },
    { label: "Sex", field: "sex", minWidth: 80 },
    { label: "Amount(Php)", field: "amount", minWidth: 150 },
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

  async function requestExportToXLS() {
    try {
      const response = await axiosClient.get("/export-clearance", {
        responseType: "blob",
      });

      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const currentDate = dayjs(); // Get current date as a Day.js object
      const formattedDate = currentDate.format("YYYY-MM-DD-HH-mm-a");

      let filename = `tagcom_clearance_${formattedDate}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

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

  return (
    <Box>
      <TablePaginate
        model={model}
        columns={columns}
        itemsPerPage={10}
        apiUrl={apiUrl}
        primaryKey="clearance"
        customHeaderAction={
          <Box>
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              size="large"
              sx={{ mb: 1 }}
              onClick={requestExportToXLS}
            >
              Export to XLS
            </Button>
          </Box>
        }
      >
        <DeleteWarningMessage />
      </TablePaginate>
    </Box>
  );
}
