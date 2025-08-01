import { Box, Modal, Tab, styled } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ViewClearanceSummary from "../../components/Home/ViewClearanceSummary";
import ClearanceForm from "../../components/Home/ClearanceForm";

export const RealTimeDateTime = () => {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date());
    }, 1000);
  }, []);

  return <>{moment(dateState).format("MMMM DD, YYYY, h:mm:ss A")}</>;
};

const Home = () => {
  const [tab, setTab] = React.useState("1");

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  interface StyledProps {
    primary?: boolean;
  }

  const StyledTabPanel = styled(Box, {
    shouldForwardProp: (prop) => prop !== "primary", // Don't pass to DOM
  })<StyledProps>(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "3em",
  }));

  return (
    <Box width={"100%"} className="private-home">
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "100%",
          }}
        >
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Clearance Form" value="1" />
            <Tab label="Records Table" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <StyledTabPanel>
            <ClearanceForm />
          </StyledTabPanel>
        </TabPanel>
        <TabPanel value="2">
          <Box>
            <ViewClearanceSummary />
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Home;
