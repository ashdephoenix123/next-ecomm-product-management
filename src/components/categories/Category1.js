import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  IconButton, // Added
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Added

export default function Category1() {
  // Form state
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '...' }

  // List state
  const [cat1List, setCat1List] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [switchState, setSwitchState] = useState({}); // Stores { "id1": true, "id2": false }

  // --- UPDATED API URL ---
  const API_URL = `/api/apiCat1`;

  // --- Data Fetching ---
  const fetchCat1List = async () => {
    setListLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setCat1List(data.data);
        // Initialize switch state based on fetched data
        // --- UPDATED to use isEnabled ---
        const initialState = data.data.reduce((acc, cat) => {
          acc[cat._id] = cat.isEnabled !== undefined ? cat.isEnabled : true;
          return acc;
        }, {});
        setSwitchState(initialState);
      }
    } catch (error) {
      console.error("Failed to fetch list", error);
      setAlert({ type: "error", message: "Failed to load category list." });
    } finally {
      setListLoading(false);
    }
  };

  // Fetch list on component mount
  useEffect(() => {
    fetchCat1List();
  }, []);

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setAlert({ type: "success", message: `${label} created successfully!` });
      setLabel(""); // Clear form
      fetchCat1List(); // <-- Refresh the list
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // --- IMPLEMENTED SWITCH HANDLER ---
  const handleSwitchChange = async (e, catId) => {
    const isChecked = e.target.checked;

    // Optimistically update the UI
    setSwitchState((prev) => ({
      ...prev,
      [catId]: isChecked,
    }));

    try {
      // Send the PUT request to /api/cat1?id=...
      const res = await fetch(`${API_URL}?id=${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // --- UPDATED to use isEnabled ---
        body: JSON.stringify({ isEnabled: isChecked }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setAlert({ type: "success", message: "Status updated!" });
    } catch (error) {
      // If API call fails, revert the switch in the UI
      setSwitchState((prev) => ({
        ...prev,
        [catId]: !isChecked,
      }));
      setAlert({ type: "error", message: error.message });
    }
  };

  // --- NEW DELETE HANDLER ---
  const handleDelete = async (catId, catLabel) => {
    // Note: In a real app, you'd show a confirmation dialog here.
    // Since we can't use window.confirm, we'll delete directly.
    setListLoading(true); // Show loading spinner on the list
    setAlert(null);
    try {
      const res = await fetch(`${API_URL}?id=${catId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setAlert({
        type: "success",
        message: `'${catLabel}' deleted successfully.`,
      });
      fetchCat1List(); // Refresh the list (will set listLoading to false)
    } catch (error) {
      setAlert({ type: "error", message: error.message });
      setListLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {/* --- Create Form --- */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6">Create New Category 1</Typography>
            <TextField
              label="Category 1 Label"
              variant="outlined"
              fullWidth
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Create
            </Button>
            {/* This alert will now show for all actions */}
            {alert && (
              <Alert severity={alert.type} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* --- Display List --- */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Categories
        </Typography>
        <Stack spacing={1}>
          {listLoading ? (
            <CircularProgress size={24} />
          ) : cat1List.length === 0 ? (
            <Typography variant="body2">No categories found.</Typography>
          ) : (
            cat1List.map((cat) => (
              <Box
                key={cat._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Chip label={cat.label} />
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchState[cat._id] || false}
                        onChange={(e) => handleSwitchChange(e, cat._id)}
                      />
                    }
                    label={switchState[cat._id] ? "Enabled" : "Disabled"}
                  />
                  {/* --- DELETE BUTTON ADDED --- */}
                  <IconButton
                    aria-label="delete category"
                    color="error"
                    onClick={() => handleDelete(cat._id, cat.label)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
