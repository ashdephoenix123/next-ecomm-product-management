import { useEffect, useState } from "react";
import EnhancedTable from "../dashboard/Lists";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    (async function fetchProducts() {
      setisloading(true);
      const fetchProducts = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getCommodities`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      const allProducts = await fetchProducts.json();
      setData(allProducts);
      setisloading(false);
    })();
  }, [isUpdated]);

  if (isloading) {
    return <p>loading products...</p>;
  }

  return <EnhancedTable products={data} setIsUpdated={setIsUpdated} />;
};

export default AllProducts;
