import { Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Actions = () => {
  const [open, setOpen] = React.useState(false);
  const [isCompleted, setisCompleted] = useState(true);
  const [inProgress, setInProgress] = useState(true);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      handleClose();
      setisCompleted(false);
      const response = await fetch(`/api/deleteAllCommodities`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        toast.success("Successfully deleted all Commodities!");
      } else {
        throw new Error("Error deleting all commodities");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting Products! Check console.");
    } finally {
      setisCompleted(true);
    }
  };

  const logOut = async () => {
    try {
      setInProgress(true);
      const response = await fetch(`/api/adminlogout`, {
        method: "POST",
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (response.status !== 200) throw new Error("Log out failed!");
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("Error logging out!");
    } finally {
      setInProgress(false);
    }
  };

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
      <Button
        sx={{ maxWidth: "fit-content" }}
        variant="contained"
        onClick={handleClickOpen}
        disabled={!isCompleted}
        loading={!isCompleted}
        loadingPosition="start"
      >
        Delete All Commodities
      </Button>
      <Button
        sx={{ maxWidth: "fit-content" }}
        variant="contained"
        onClick={logOut}
        disabled={!inProgress}
        loading={!inProgress}
        loadingPosition="start"
      >
        Log Out
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete all Commodities</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all Commodities? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Actions;
