const emptyVariant = {
  size: [],
  stock: 0,
  images: [],
  color: "",
  price: 0,
};

const newProduct = {
  name: "",
  description: "",
  category: "",
  variants: [{ ...emptyVariant }],
};

export default newProduct;
