import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  // New imports for Table, Pagination, etc.
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Category3Manage() {
  // --- API URLs ---
  const API_URL_CAT1 = `/api/apiCat1`;
  const API_URL_CAT2 = `/api/apiCat2`;
  const API_URL_CAT3 = `/api/apiCat3`;

  // --- Form State ---
  const [label, setLabel] = useState("");
  const [selectedCat1Form, setSelectedCat1Form] = useState("");
  const [selectedCat2Form, setSelectedCat2Form] = useState("");

  // --- Data State ---
  const [cat1List, setCat1List] = useState([]);
  const [cat2List, setCat2List] = useState([]); // Full list of Cat2
  const [cat3List, setCat3List] = useState([]); // Full list of Cat3
  const [filteredCat2ListForm, setFilteredCat2ListForm] = useState([]); // Filtered list for the *form*

  // --- UI State ---
  const [loading, setLoading] = useState(false); // For form submission
  const [listLoading, setListLoading] = useState(true); // For table
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // --- Data Fetching ---
  const fetchCat1 = async () => {
    try {
      const res = await fetch(API_URL_CAT1);
      const data = await res.json();
      if (data.success) setCat1List(data.data);
    } catch (error) {
      console.error("Failed to fetch Cat1 list", error);
    }
  };

  const fetchCat2 = async () => {
    try {
      const res = await fetch(API_URL_CAT2);
      const data = await res.json();
      if (data.success) setCat2List(data.data);
    } catch (error) {
      console.error("Failed to fetch Cat2 list", error);
    }
  };

  const fetchCat3List = async () => {
    setListLoading(true);
    try {
      const res = await fetch(API_URL_CAT3);
      const data = await res.json();
      if (data.success) setCat3List(data.data);
    } catch (error) {
      console.error("Failed to fetch Cat3 list", error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchCat1();
    fetchCat2();
    fetchCat3List();
  }, []);

  // --- Form Dynamic Filtering ---
  useEffect(() => {
    if (selectedCat1Form) {
      const filtered = cat2List.filter(
        (cat2) => cat2.cat1._id === selectedCat1Form
      );
      setFilteredCat2ListForm(filtered);
      setSelectedCat2Form("");
    } else {
      setFilteredCat2ListForm([]);
      setSelectedCat2Form("");
    }
  }, [selectedCat1Form, cat2List]);

  // --- Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(API_URL_CAT3, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          cat1: selectedCat1Form,
          cat2: selectedCat2Form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setAlert({ type: "success", message: `${label} created successfully!` });
      setLabel("");
      setSelectedCat1Form("");
      setSelectedCat2Form("");
      fetchCat3List(); // Refresh list
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // --- Table Handlers ---

  const handleUpdate = async (cat3Id, field, newValue) => {
    setListLoading(true); // Use table loading
    try {
      const res = await fetch(`${API_URL_CAT3}?id=${cat3Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newValue }), // e.g., { cat1: "newId" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic update of local state to prevent flicker
      // Or just refetch
      fetchCat3List();
    } catch (error) {
      setAlert({
        type: "error",
        message: `Failed to update: ${error.message}`,
      });
      setListLoading(false);
    }
  };

  const handleDelete = async (catId, catLabel) => {
    setListLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`${API_URL_CAT3}?id=${catId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAlert({
        type: "success",
        message: `${catLabel} deleted successfully!`,
      });
      fetchCat3List(); // Refresh list
    } catch (error) {
      setAlert({ type: "error", message: error.message });
      setListLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* --- Create Form --- */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6">Create New Category 3</Typography>

            <FormControl fullWidth required>
              <InputLabel id="cat1-form-label">Select Category 1</InputLabel>
              <Select
                labelId="cat1-form-label"
                value={selectedCat1Form}
                label="Select Category 1"
                onChange={(e) => setSelectedCat1Form(e.target.value)}
              >
                {cat1List.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!selectedCat1Form}>
              <InputLabel id="cat2-form-label">Select Category 2</InputLabel>
              <Select
                labelId="cat2-form-label"
                value={selectedCat2Form}
                label="Select Category 2"
                onChange={(e) => setSelectedCat2Form(e.target.value)}
              >
                {filteredCat2ListForm.length > 0 ? (
                  filteredCat2ListForm.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {selectedCat1Form
                      ? "No Cat 2 items for this Cat 1"
                      : "Select Cat 1 first"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              label="Category 3 Label"
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
          </Stack>
        </Box>
      </Paper>

      {/* --- Global Alert --- */}
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* --- Display List Table --- */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Categories 3
        </Typography>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  Parent (Category 1)
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  Parent (Category 2)
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                cat3List
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cat) => (
                    <TableRow hover key={cat._id}>
                      <TableCell component="th" scope="row">
                        {cat.label}
                      </TableCell>
                      {/* --- Cat 1 Autocomplete --- */}
                      <TableCell>
                        <Autocomplete
                          size="small"
                          options={cat1List}
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, val) =>
                            option._id === val._id
                          }
                          value={
                            cat1List.find((c1) => c1._id === cat.cat1?._id) ||
                            null
                          }
                          onChange={(event, newValue) => {
                            if (newValue && newValue._id !== cat.cat1?._id) {
                              // IMPORTANT: Updating Cat1 will require updating Cat2 as well
                              // For simplicity, we just update Cat1 here.
                              // A better UX might force them to re-select Cat2.
                              handleUpdate(cat._id, "cat1", newValue._id);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} variant="standard" />
                          )}
                        />
                      </TableCell>
                      {/* --- Cat 2 Autocomplete --- */}
                      <TableCell>
                        <Autocomplete
                          size="small"
                          // Filter options based on *this row's* Cat1
                          options={cat2List.filter(
                            (c2) => c2.cat1?._id === cat.cat1?._id
                          )}
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, val) =>
                            option._id === val._id
                          }
                          value={
                            cat2List.find((c2) => c2._id === cat.cat2?._id) ||
                            null
                          }
                          onChange={(event, newValue) => {
                            if (newValue && newValue._id !== cat.cat2?._id) {
                              handleUpdate(cat._id, "cat2", newValue._id);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} variant="standard" />
                          )}
                          // Disable if no Cat1 is selected for this row
                          disabled={!cat.cat1}
                        />
                      </TableCell>
                      {/* --- Actions --- */}
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(cat._id, cat.label)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={cat3List.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}
