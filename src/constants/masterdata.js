const cat1 = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const cat2 = [
  { cat1id: "men", id: "topwear-men", label: "Topwear" },
  { cat1id: "women", id: "topwear-women", label: "Topwear" },
  { cat1id: "men", id: "bottomwear-men", label: "Bottomwear" },
];

const cat3 = [
  { cat1id: "men", cat2id: "topwear-men", id: "t-shirts", label: "Tshirts" },
  {
    cat1id: "women",
    cat2id: "topwear-women",
    id: "t-shirts",
    label: "Tshirts",
  },
];

const productSchema = {
  sku: "",
  slug: "",
  name: "",
  description: "",
  category1: [],
  category2: "",
  category3: "",
  variants: {
    type: [
      {
        size: [],
        images: [],
        color: "",
        stock: null,
        price: null,
      },
    ],
    required: true,
  },
};
