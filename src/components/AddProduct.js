import ProductForm from "@/components/ProductForm";

// Define the default structure for a new product
const emptyVariant = {
  size: [],
  stock: 0,
  images: [],
  color: "",
  price: 0,
};

const emptyProduct = {
  name: "",
  description: "",
  category: "clothing", // Or any default
  variants: [{ ...emptyVariant }],
  // Notice there is no _id, sku, or slug
};

const AddProductPage = () => {
  return (
    <div className="container mx-auto my-12">
      {/* Pass the emptyProduct object as the 'product' prop.
        The ProductForm will now be initialized with this empty state.
      */}
      <ProductForm product={emptyProduct} />
    </div>
  );
};

export default AddProductPage;
