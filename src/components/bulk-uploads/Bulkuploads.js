import { Box, Button, Paper, Typography, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import toast from "react-hot-toast";

const BulkUploads = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false); // NEW: State for drag feedback
  const inputRef = useRef(null);
  const theme = useTheme();

  const openFileManager = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(""); // Clear status when a new file is selected
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStatus("");
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  // --- NEW: Drag and Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      // Check if the file is a CSV
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setStatus("");
        // Sync the dropped file with the file input
        if (inputRef.current) {
          inputRef.current.files = files;
        }
      } else {
        setStatus("Error: Only .csv files are allowed.");
        setFile(null);
      }
    }
  };
  // --- End of new handlers ---

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    setStatus("Uploading...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-csv`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`Uploaded! Inserted ${data.inserted} rows`);
        handleRemoveFile(); // Clear file on successful upload
        toast.success("Successfully uploaded products");
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
      toast.error("Error uploading bulk products");
    } finally {
      // Clear status message after 3 seconds, whether success or error
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  };

  return (
    <Box>
      <Typography
        component="h2"
        variant="h5"
        className="text-lg font-bold mb-2"
        mb={2}
      >
        Bulk Upload Products
      </Typography>

      {/* --- CSV template download section --- */}
      <Paper
        component="a"
        href="/template.csv"
        download="product_template.csv"
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          textDecoration: "none",
          color: "text.primary",
          maxWidth: "sm",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <DescriptionIcon color="primary" fontSize="large" />
        <Box>
          <Typography fontWeight={600}>Download CSV Template</Typography>
          <Typography variant="body2" color="textSecondary">
            Click here to download the required file format.
          </Typography>
        </Box>
      </Paper>
      {/* --- END OF SECTION --- */}

      <Box component="form" onSubmit={handleUpload}>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".csv"
          onChange={handleFileChange}
          className="mb-2"
        />
        <Box
          textAlign="center"
          maxWidth="sm"
          border={2} // Use a slightly thicker border
          px={4}
          py={6}
          borderRadius={2}
          // --- DYNAMIC STYLES ---
          borderColor={
            isDragging ? theme.palette.primary.main : theme.palette.grey["500"]
          }
          borderStyle={isDragging ? "dashed" : "solid"}
          backgroundColor={
            isDragging ? theme.palette.action.hover : "transparent"
          }
          // --- END DYNAMIC STYLES ---
          component="button"
          type="button"
          onClick={openFileManager}
          display="block"
          mb={2}
          sx={{ width: "100%", transition: "all 0.2s ease-in-out" }} // Add transition
          // --- ADD EVENT HANDLERS ---
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          // --- END EVENT HANDLERS ---
        >
          <AddBoxIcon fontSize="large" color="primary" />
          <Typography fontWeight={600} color="textPrimary" mt={2}>
            {/* Dynamic text */}
            {isDragging
              ? "Drop the file here..."
              : "Click or drag file to this area to upload"}
          </Typography>
          <Typography fontSize={14} color="textSecondary">
            Note: Only CSV Files need to be uploaded for adding products in
            bulk.
          </Typography>
        </Box>

        {/* --- Display selected file section --- */}
        {file && (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "sm",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                flexGrow: 1,
                textAlign: "left",
              }}
            >
              {file.name}
            </Typography>
            <IconButton
              onClick={handleRemoveFile}
              size="small"
              aria-label="remove selected file"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        )}
        {/* --- END OF SECTION --- */}

        <Button
          type="submit"
          variant="contained"
          disabled={!file || status === "Uploading..."}
        >
          Upload
        </Button>
      </Box>
      {status && <Typography mt={2}>{status}</Typography>}
    </Box>
  );
};

export default BulkUploads;
