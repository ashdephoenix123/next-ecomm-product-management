import { useEffect, useState } from "react";
import EnhancedTable from "../dashboard/Lists";

/**
 * Helper function to convert the table's sort state (orderBy, order)
 * into the 'sortby' string your API expects.
 *
 * IMPORTANT: You need to update your API's 'sortby' logic
 * to handle these new values (e.g., 'name-asc', 'name-desc').
 */
const getSortByValue = (orderBy, order) => {
  if (orderBy === "name") {
    return order === "asc" ? "name-asc" : "name-desc";
  }
  if (orderBy === "category") {
    return order === "asc" ? "category-asc" : "category-desc";
  }

  // Default fallback
  return "whats-new";
};

const AllProducts = () => {
  // State for the *current page* of products
  const [data, setData] = useState([]);

  // State for the pagination data from the API
  const [pagination, setPagination] = useState({
    totalCommodities: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // State for re-fetching after delete/update
  const [isUpdated, setIsUpdated] = useState(false);
  const [isloading, setisloading] = useState(true); // Start loading true

  // --- State for Server-Side Pagination & Sorting ---
  // This state is controlled by the parent and passed to EnhancedTable

  // MUI TablePagination is 0-indexed for the 'page' prop
  const [page, setPage] = useState(0);

  // Default rows per page (matches your old component's default)
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default sort order
  const [order, setOrder] = useState("desc");

  /**
   * Default 'orderBy' column.
   * 'createdAt' is not in your headCells, so we use it as a
   * special value to map to the API's 'whats-new' default.
   */
  const [orderBy, setOrderBy] = useState("createdAt");

  useEffect(() => {
    // This function will fetch data based on the current state
    (async function fetchProducts() {
      setisloading(true);

      // 1. Determine the 'sortby' value for the API
      let sortby;
      if (orderBy === "createdAt") {
        sortby = "whats-new"; // API's default
      } else {
        sortby = getSortByValue(orderBy, order);
      }

      // 2. Prepare the request body
      const requestBody = {
        page: page + 1, // API is 1-indexed, MUI Table is 0-indexed
        limit: rowsPerPage,
        sortby: sortby,
        // You can add other filters (categories, brands) here if needed
      };

      // 3. Fetch the data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getCommodities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      // 4. Update state with the new API response structure
      if (result && result.commodities && result.pagination) {
        setData(result.commodities);
        setPagination(result.pagination);
      } else {
        // Handle error or empty response
        setData([]);
        setPagination({ totalCommodities: 0, totalPages: 1, currentPage: 1 });
      }

      setisloading(false);
    })();
  }, [isUpdated, page, rowsPerPage, order, orderBy]); // Re-fetch when any of these change

  // --- Handlers to pass down to EnhancedTable ---

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page after sorting
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Show a loading state only on the initial load
  if (isloading && data.length === 0) {
    return <p>loading products...</p>;
  }

  return (
    <EnhancedTable
      products={data}
      setIsUpdated={setIsUpdated}
      // --- Pass all the required state and handlers to the table ---
      totalCommodities={pagination.totalCommodities}
      page={page}
      rowsPerPage={rowsPerPage}
      order={order}
      orderBy={orderBy}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onRequestSort={handleRequestSort}
    />
  );
};

export default AllProducts;
