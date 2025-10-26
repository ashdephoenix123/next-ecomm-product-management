import ProductForm from "@/components/ProductForm";
import newProduct from "@/constants/newProduct";

const AddProductPage = () => {
  return (
    <div className="container mx-auto my-12">
      <ProductForm product={newProduct} />
    </div>
  );
};

export default AddProductPage;
