import { colors } from "@/constants/colors";
import newProduct from "@/constants/newProduct";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Dialog, // Import Dialog components
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  createFilterOptions, // Import createFilterOptions
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const emptyVariant = {
  size: [],
  stock: 0,
  images: [],
  color: "",
  price: 0,
};

// Helper function to find the full object from options by its ID
// --- UPDATED: Added optional chaining ---
const findById = (options, id) =>
  options?.find((option) => option._id === id) || null;

// --- New: Filter function for "Add Brand" ---
const filter = createFilterOptions();

// --- NEW: Helper function to get a safe initial state ---
const getInitialState = (productDetails) => {
  // Start with newProduct if it's not an edit, or productDetails if it is
  const initialState =
    productDetails && productDetails._id ? productDetails : newProduct;

  // --- Robustness checks to prevent spinner bug ---
  // Ensure the category object exists
  if (!initialState.category) {
    initialState.category = { main: null, sub: null, third: null };
  }
  // Ensure brand key exists
  if (initialState.brand === undefined) {
    initialState.brand = null;
  }
  // Ensure variants array exists and is not empty
  if (!initialState.variants || initialState.variants.length === 0) {
    initialState.variants = [{ ...emptyVariant }];
  }

  return initialState;
};

export default function ProductForm({ product: productDetails }) {
  const router = useRouter();
  // --- UPDATED: Use the safe initializer function ---
  const [product, setProduct] = useState(() => getInitialState(productDetails));
  const isEditMode = productDetails && productDetails._id;

  // --- State for fetched data ---
  const [brands, setBrands] = useState([]);
  const [cat1List, setCat1List] = useState([]);
  const [cat2List, setCat2List] = useState([]);
  const [cat3List, setCat3List] = useState([]);

  // --- State for dependent dropdowns ---
  const [filteredCat2, setFilteredCat2] = useState([]);
  const [filteredCat3, setFilteredCat3] = useState([]);

  // --- State for loading indicators ---
  const [loading, setLoading] = useState({
    brands: false,
    cat1: false,
    cat2: false,
    cat3: false,
  });

  // --- New: State for the "Add Brand" dialog ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState(""); // Holds the name of the new brand

  // --- UPDATED: Effect to sync prop changes to state ---
  // This now also uses the safe initializer
  useEffect(() => {
    setProduct(getInitialState(productDetails));
  }, [productDetails]);

  // --- Fetch all required data on component mount ---
  useEffect(() => {
    // Fetch Brands
    (async () => {
      setLoading((prev) => ({ ...prev, brands: true }));
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/getBrands");
        const data = await res.json();
        if (data.success) setBrands(data.brands);
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
      setLoading((prev) => ({ ...prev, brands: false }));
    })();

    // Fetch Cat1
    (async () => {
      setLoading((prev) => ({ ...prev, cat1: true }));
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/apiCat1");
        const data = await res.json();
        if (data.success) setCat1List(data.data);
      } catch (error) {
        console.error("Failed to fetch Cat1", error);
      }
      setLoading((prev) => ({ ...prev, cat1: false }));
    })();

    // Fetch All Cat2 (for cascading)
    (async () => {
      setLoading((prev) => ({ ...prev, cat2: true }));
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/apiCat2");
        const data = await res.json();
        if (data.success) setCat2List(data.data);
      } catch (error) {
        console.error("Failed to fetch Cat2", error);
      }
      setLoading((prev) => ({ ...prev, cat2: false }));
    })();

    // Fetch All Cat3 (for cascading)
    (async () => {
      setLoading((prev) => ({ ...prev, cat3: true }));
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/apiCat3");
        const data = await res.json();
        if (data.success) setCat3List(data.data);
      } catch (error) {
        console.error("Failed to fetch Cat3", error);
      }
      setLoading((prev) => ({ ...prev, cat3: false }));
    })();
  }, []);

  // --- Effect for cascading Cat 2 dropdown ---
  // This useEffect now safely waits for `product.category` to be defined
  useEffect(() => {
    if (product && product.category && product.category.main) {
      const filtered = cat2List.filter(
        (cat2) => cat2.cat1._id === product.category.main
      );
      setFilteredCat2(filtered);
    } else {
      setFilteredCat2([]);
    }
    // Only clear sub-categories if main is changed *after* initial load
    if (
      !isEditMode &&
      product &&
      product.category &&
      product.category.main // Only trigger if main has a value
    ) {
      setProduct((prev) => ({
        ...prev,
        category: { ...prev.category, sub: null, third: null },
      }));
    }
  }, [product?.category?.main, cat2List, isEditMode]); // Added product and safe-chaining

  // --- Effect for cascading Cat 3 dropdown ---
  // This useEffect now safely waits for `product.category` to be defined
  useEffect(() => {
    if (product && product.category && product.category.sub) {
      console.log(product, "\n", cat3List);

      const filtered = cat3List.filter(
        (cat3) => cat3.cat2._id === product.category.sub
      );
      setFilteredCat3(filtered);
    } else {
      setFilteredCat3([]);
    }
    // Only clear third-category if sub is changed *after* initial load
    if (
      !isEditMode &&
      product &&
      product.category &&
      product.category.sub // Only trigger if sub has a value
    ) {
      setProduct((prev) => ({
        ...prev,
        category: { ...prev.category, third: null },
      }));
    }
  }, [product?.category?.sub, cat3List, isEditMode]); // Added product and safe-chaining

  // Handler for top-level fields (name, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Updated: Handler for Brand Autocomplete ---
  const handleBrandChange = (event, newValue) => {
    if (typeof newValue === "string") {
      // User typed a new value
      setDialogValue(newValue);
      setDialogOpen(true);
    } else if (newValue && newValue.inputValue) {
      // User clicked "Add '...'"
      // The inputValue is the raw string the user typed
      setDialogValue(newValue.inputValue);
      setDialogOpen(true);
    } else {
      // User selected an existing brand
      setProduct((prev) => ({
        ...prev,
        brand: newValue ? newValue._id : null,
      }));
    }
  };

  // --- New: Dialog close handler ---
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogValue("");
  };

  // --- New: Dialog submit handler (creates the brand) ---
  const handleSubmitDialog = async () => {
    if (!dialogValue) return;

    try {
      // Call the new API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addBrand`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: dialogValue }),
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        const newBrand = data.brand;
        // Add new brand to state and select it
        setBrands([...brands, newBrand]);
        setProduct((prev) => ({
          ...prev,
          brand: newBrand._id, // Select the new brand's ID
        }));
        handleCloseDialog();
      } else {
        alert(`Error: ${data.error || "Failed to add brand"}`);
      }
    } catch (error) {
      console.error("Failed to submit new brand:", error);
      alert("An error occurred while adding the brand.");
    }
  };

  // --- NEW: Handler for Category Autocompletes ---
  const handleCategoryChange = (level, newValue) => {
    setProduct((prev) => {
      const newCategory = { ...prev.category };

      if (level === "main") {
        newCategory.main = newValue ? newValue._id : null;
        newCategory.sub = null;
        newCategory.third = null;
      }
      if (level === "sub") {
        newCategory.sub = newValue ? newValue._id : null;
        newCategory.third = null;
      }
      if (level === "third") {
        newCategory.third = newValue ? newValue._id : null;
      }

      return { ...prev, category: newCategory };
    });
  };

  // Handler for text fields inside a variant
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...product.variants];
    newVariants[index] = {
      ...newVariants[index],
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
    if (product.variants.length <= 1) {
      alert("A product must have at least one variant.");
      return;
    }
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, name, description, brand, category, variants } = product;

    const payload = {
      name,
      description,
      brand: brand || null,
      category: {
        main: category.main || null,
        sub: category.sub || null,
        third: category.third || null,
      },
      variants,
    };

    if (isEditMode) {
      payload.productId = _id;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/updateCommodity`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Product updated successfully!");
        } else {
          alert(`Error: ${data.error || "Failed to update"}`);
        }
      } catch (error) {
        console.log(error);
        alert("Error occurred, check console");
      }
    } else {
      try {
        console.log(payload);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addCommodity`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Product created successfully!");
          setProduct(getInitialState(newProduct)); // Reset form to a clean state
        } else {
          alert(`Error: ${data.error || "Failed to create product"}`);
        }
      } catch (error) {
        console.log(error);
        alert("Error occurred, check console");
      }
    }
  };

  // This guard now checks for product AND product.category
  // The new getInitialState function ensures this always passes
  if (!product || !product.category) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            {/* --- Read-only Fields --- */}
            {isEditMode && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="SKU"
                    value={product.sku}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    helperText="Readonly"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Slug"
                    value={product.slug}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    helperText="Readonly"
                  />
                </Grid>
              </>
            )}

            {/* --- Editable Fields --- */}
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

            {/* --- Updated: Brand Autocomplete with freeSolo --- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <Autocomplete
                  value={findById(brands, product.brand)}
                  onChange={handleBrandChange}
                  freeSolo // Allow user to type new values
                  options={brands}
                  getOptionLabel={(option) => {
                    // Handle string input (when user types)
                    if (typeof option === "string") {
                      return option;
                    }
                    // Handle "Add new" option
                    if (option.inputValue) {
                      // This is the formatted "Add brand: '...'" string
                      return option.label;
                    }
                    // Handle existing brand object
                    return option.label || "";
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                      (option) => inputValue === option.label
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue: inputValue, // Store the raw value
                        label: `Add brand: "${inputValue}"`, // This is what is shown
                      });
                    }
                    return filtered;
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  loading={loading.brands}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Brand"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading.brands ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.label}</li>
                  )}
                />
              </FormControl>
            </Grid>

            {/* --- Cat 1 Autocomplete --- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <Autocomplete
                  value={findById(cat1List, product.category.main)}
                  onChange={(e, newValue) =>
                    handleCategoryChange("main", newValue)
                  }
                  options={cat1List}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  loading={loading.cat1}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category 1 (Main)"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading.cat1 ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* --- Cat 2 Autocomplete (Dependent) --- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <Autocomplete
                  value={findById(filteredCat2, product.category.sub)}
                  onChange={(e, newValue) =>
                    handleCategoryChange("sub", newValue)
                  }
                  options={filteredCat2}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  disabled={!product.category.main}
                  loading={loading.cat2}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category 2 (Sub)"
                      helperText={
                        !product.category.main ? "Select Cat 1 first" : ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* --- Cat 3 Autocomplete (Dependent) --- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <Autocomplete
                  value={findById(filteredCat3, product.category.third)}
                  onChange={(e, newValue) =>
                    handleCategoryChange("third", newValue)
                  }
                  options={filteredCat3}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  disabled={!product.category.sub}
                  loading={loading.cat3}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category 3 (Third)"
                      helperText={
                        !product.category.sub ? "Select Cat 2 first" : ""
                      }
                    />
                  )}
                />
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

                  {/* Variant Grid */}
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    {/* Sizes & Colors */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={variant.size}
                        onChange={(event, newValue) => {
                          let valuesInUpper = newValue.map((val) =>
                            val.toUpperCase()
                          );
                          handleAutocompleteChange(
                            index,
                            "size",
                            valuesInUpper
                          );
                        }}
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
                      <Autocomplete
                        value={variant.color}
                        onChange={(event, newValue) => {
                          handleAutocompleteChange(
                            index,
                            "color",
                            newValue?.id || newValue
                          );
                        }}
                        disablePortal
                        autoHighlight
                        options={colors || []}
                        getOptionLabel={(option) => option.label || option}
                        renderInput={(params) => (
                          <TextField {...params} label="Color" />
                        )}
                      />
                    </Grid>

                    {/* Stock & Price */}
                    <Grid size={{ xs: 12, md: 6 }}>
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

                    {/* Image URLs */}
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

                    {/* Image Previews */}
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
                  </Grid>
                </Paper>
              </Grid>
            ))}

            {/* --- Form Actions --- */}
            <Grid size={{ xs: 12 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                sx={{ width: "100%", mt: 2 }}
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

      {/* --- New: "Add Brand" Dialog Component --- */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add a new brand</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The brand {dialogValue} was not found. Please confirm to add it.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-brand-label"
            label="New Brand Name"
            type="text"
            fullWidth
            variant="standard"
            value={dialogValue}
            onChange={(e) => setDialogValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitDialog}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
