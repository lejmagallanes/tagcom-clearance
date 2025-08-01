import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

const ForbiddenPage = observer(() => {
  return (
    <div>
      <Box>
        <Typography variant="h3"> This is Forbidden Page</Typography>
      </Box>
      <Link to="/login">Login here</Link>
    </div>
  );
});

export default ForbiddenPage;
