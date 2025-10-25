import { Button, Paper, Typography } from "@mui/material";
import React from "react";

const Actions = () => {
  return (
    <Paper
      sx={{
        maxWidth: "sm",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography component="h4" variant="h5" mb={1}>
        Important Actions
      </Typography>
      <Button sx={{ maxWidth: "fit-content" }} variant="contained">
        Delete All Commodities
      </Button>
      <Button sx={{ maxWidth: "fit-content" }} variant="contained">
        Log Out
      </Button>
    </Paper>
  );
};

export default Actions;
