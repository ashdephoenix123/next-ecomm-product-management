import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  FormControl, // Kept for form structure, though Select is replaced
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton, // Added
  Autocomplete, // Added
  Table, // Added
  TableBody, // Added
  TableCell, // Added
  TableContainer, // Added
  TableHead, // Added
  TableRow, // Added
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Added

export default function Category2() {
  // --- Form State ---
  const [label, setLabel] = useState("");
  const [selectedCat1, setSelectedCat1] = useState(""); // This will store the ID

  // --- Data State ---
  const [cat1List, setCat1List] = useState([]); // For the <Autocomplete> dropdown
  const [cat2List, setCat2List] = useState([]); // For the display list

  // --- UI State ---
  const [loading, setLoading] = useState(false); // For form submission
  const [alert, setAlert] = useState(null);
  const [listLoading, setListLoading] = useState(true); // For the list
  // switchState removed as requested

  // --- API URLs ---
  const API_URL_CAT1 = `${process.env.NEXT_PUBLIC_API_URL}/apiCat1`;
  const API_URL_CAT2 = `${process.env.NEXT_PUBLIC_API_URL}/apiCat2`;

  // --- Data Fetching ---
  const fetchCat1 = async () => {
    try {
      const res = await fetch(API_URL_CAT1);
      const data = await res.json();
      if (data.success) {
        // Only show enabled Cat1 items in the dropdown
        setCat1List(data.data.filter((cat) => cat.isEnabled));
      }
    } catch (error) {
      console.error("Failed to fetch Cat1 list", error);
      setAlert({ type: "error", message: "Failed to load Category 1 list." });
    }
  };

  const fetchCat2List = async () => {
    setListLoading(true);
    try {
      const res = await fetch(API_URL_CAT2);
      const data = await res.json();
      if (data.success) {
        setCat2List(data.data);
        // Removed switchState initialization
      }
    } catch (error) {
      console.error("Failed to fetch Cat2 list", error);
      setAlert({ type: "error", message: "Failed to load Category 2 list." });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchCat1();
    fetchCat2List();
  }, []);

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(API_URL_CAT2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, cat1: selectedCat1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setAlert({ type: "success", message: `${label} created successfully!` });
      setLabel("");
      setSelectedCat1(""); // Reset autocomplete
      fetchCat2List(); // Refresh the list
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // handleSwitchChange removed as requested

  // --- New Handler to update Cat1 parent ---
  const handleCat1Update = async (cat2Id, newCat1Id) => {
    setListLoading(true); // Use listLoading to show feedback
    setAlert(null);
    try {
      const res = await fetch(`${API_URL_CAT2}?id=${cat2Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cat1: newCat1Id }), // Send only the field to update
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update parent.");
      }
      setAlert({ type: "success", message: "Parent category updated!" });
      fetchCat2List(); // This will refresh the list and set listLoading to false
    } catch (error) {
      setAlert({ type: "error", message: error.message });
      setListLoading(false); // Ensure loading stops on error
    }
  };

  const handleDelete = async (catId, catLabel) => {
    // Removed window.confirm() as per instructions
    setListLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`${API_URL_CAT2}?id=${catId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAlert({
        type: "success",
        message: `'${catLabel}' deleted successfully.`,
      });
      fetchCat2List();
    } catch (error) {
      setAlert({ type: "error", message: error.message });
      setListLoading(false);
    }
  };

  // Find the full object for the Autocomplete's value
  const autocompleteValue =
    cat1List.find((cat) => cat._id === selectedCat1) || null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {/* --- Create Form --- */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6">Create New Category 2</Typography>
            <Autocomplete
              options={cat1List}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={autocompleteValue}
              onChange={(event, newValue) => {
                setSelectedCat1(newValue ? newValue._id : "");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Category 1" required />
              )}
            />
            <TextField
              label="Category 2 Label"
              variant="outlined"
              fullWidth
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !selectedCat1} // Also disable if no Cat1 is selected
              startIcon={loading && <CircularProgress size={20} />}
            >
              Create
            </Button>
            {/* Alert for form submission */}
            {alert && (
              <Alert severity={alert.type} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* --- Display List --- */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Categories 2
        </Typography>
        {listLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : cat2List.length === 0 ? (
          <Typography variant="body2">No categories found.</Typography>
        ) : (
          <TableContainer>
            <Table size="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    Parent (Category 1)
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cat2List.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell component="th" scope="row">
                      {cat.label}
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        options={cat1List}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        // Find the full object for the current value
                        value={
                          cat1List.find((c1) => c1._id === cat.cat1?._id) ||
                          null
                        }
                        onChange={(event, newValue) => {
                          if (newValue && newValue._id !== cat.cat1?._id) {
                            handleCat1Update(cat._id, newValue._id);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Select parent"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete category"
                        color="error"
                        onClick={() => handleDelete(cat._id, cat.label)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
