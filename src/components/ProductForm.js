import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";

// --- Dummy Data ---
const categoryOptions = ["clothing", "electronics", "books", "home-decor"];

const emptyVariant = {
  size: [],
  stock: 0,
  images: [],
  color: "",
  price: 0,
};

export default function ProductForm({ product: productDetails }) {
  const router = useRouter();
  const [product, setProduct] = useState(productDetails);

  const isEditMode = productDetails && productDetails._id;

  // Handler for top-level fields (name, description, category)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for text fields inside a variant
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...product.variants];
    newVariants[index] = {
      ...newVariants[index],
      // Use parseFloat for number fields
      [name]: name === "stock" || name === "price" ? parseFloat(value) : value,
    };
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  // Handler for Autocomplete fields (array of strings)
  const handleAutocompleteChange = (index, field, newValue) => {
    const newVariants = [...product.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: newValue,
    };
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  // Add a new empty variant to the state
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...emptyVariant }],
    }));
  };

  // Remove a variant by its index
  const removeVariant = (index) => {
    // Prevent removing the last variant
    if (product.variants.length <= 1) {
      alert("A product must have at least one variant.");
      return;
    }
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      // --- UPDATE LOGIC (Your existing code) ---
      const { _id, name, description, category, variants } = product;
      const payload = {
        productId: _id,
        name,
        description,
        category,
        variants,
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/updateCommodity`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json(); // <-- Use 'data'
        if (response.ok) {
          // <-- Check response.ok
          alert("Product updated successfully!");
        } else {
          alert(`Error: ${data.error || "Failed to update"}`);
        }
      } catch (error) {
        console.log(error);
        alert("Error occurred, check console");
      }
    } else {
      // --- CREATE LOGIC (For new products) ---
      const { name, description, category, variants } = product;
      // Payload doesn't include _id or productId
      const payload = { name, description, category, variants };

      try {
        // ASSUMPTION: You have a '/addCommodity' endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addCommodity`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Product created successfully!");
          // Optional: Redirect to the new product's edit page or product list
          // ASSUMPTION: The response 'data' includes the new product's slug
          if (data.newProduct && data.newProduct.slug) {
            router.push(`/admin/products/${data.newProduct.slug}`);
          } else {
            router.push("/"); // Fallback redirect
          }
        } else {
          alert(`Error: ${data.error || "Failed to create product"}`);
        }
      } catch (error) {
        console.log(error);
        alert("Error occurred, check console");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => router.push("/")}>
            Go Back
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? "Edit Product" : "Add New Product"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* --- Read-only Fields (Row 1) --- */}
            {isEditMode && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  {/* <-- UPDATED */}
                  <TextField
                    label="SKU"
                    value={product.sku}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    helperText="Readonly"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  {/* <-- UPDATED */}
                  <TextField
                    label="Slug"
                    value={product.slug}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    helperText="Readonly"
                  />
                </Grid>
              </>
            )}

            {/* --- Editable Fields (Full Width) --- */}
            <Grid size={12}>
              <TextField
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                >
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* --- Variants Section --- */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                Variants
              </Typography>
            </Grid>

            {product.variants.map((variant, index) => (
              <Grid size={12} key={index}>
                <Paper variant="outlined" sx={{ p: 2, position: "relative" }}>
                  <Typography variant="h6" gutterBottom>
                    Variant {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeVariant(index)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    disabled={product.variants.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>

                  {/* --- Variant Grid --- */}
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    {/* Row 1: Sizes & Colors */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      {" "}
                      {/* <-- UPDATED */}
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={variant.size}
                        onChange={(event, newValue) =>
                          handleAutocompleteChange(index, "size", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sizes"
                            placeholder="Type and press Enter"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {" "}
                      {/* <-- UPDATED */}
                      {/* <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={variant.color}
                        onChange={(event, newValue) =>
                          handleAutocompleteChange(index, "color", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Colors"
                            placeholder="Type and press Enter"
                          />
                        )}
                      /> */}
                    </Grid>

                    {/* Row 2: Stock & Price */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      {" "}
                      {/* <-- UPDATED */}
                      <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, e)}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {" "}
                      {/* <-- UPDATED */}
                      <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, e)}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Row 3: Image URLs */}
                    <Grid size={12}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={variant.images}
                        onChange={(event, newValue) =>
                          handleAutocompleteChange(index, "images", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Image URLs"
                            placeholder="Paste URL and press Enter"
                          />
                        )}
                      />
                    </Grid>

                    {/* --- NEW: Image Preview Section --- */}
                    {variant.images.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mb: 1, mt: 1 }}
                        >
                          Image Previews:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          {variant.images.map((url, imgIndex) => (
                            <Box
                              key={imgIndex}
                              component="img"
                              src={url}
                              alt={`Preview ${imgIndex + 1}`}
                              sx={{
                                height: 100,
                                width: 100,
                                objectFit: "contain",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                              // Handle broken image links
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/100?text=Invalid+URL";
                              }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    {/* --- End of Image Preview --- */}
                  </Grid>
                </Paper>
              </Grid>
            ))}

            {/* --- Form Actions --- */}
            <Grid size={{ xs: 12, md: "auto" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
              >
                <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  onClick={addVariant}
                >
                  Add Variant
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {isEditMode ? "Save Changes" : "Create Product"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
