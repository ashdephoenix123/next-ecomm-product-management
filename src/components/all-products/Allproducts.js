import { useEffect, useState } from "react";
import EnhancedTable from "../dashboard/Lists";

const AllProducts = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async function fetchProducts() {
      const fetchProducts = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getCommodities`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      const allProducts = await fetchProducts.json();
      setData(allProducts);
    })();
  }, []);

  return <EnhancedTable products={data} />;
};

export default AllProducts;
