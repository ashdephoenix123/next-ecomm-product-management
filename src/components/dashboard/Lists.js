import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";

// Note: getComparator and descendingComparator are no longer needed
// if all sorting is done server-side. However, we keep them
// in case you want to re-enable any client-side sorting.
// For a pure server-side table, these can be deleted.

const headCells = [
  {
    id: "sku",
    numeric: false,
    disablePadding: false,
    label: "SKU",
    reorder: false,
  },
  {
    id: "image",
    numeric: false,
    disablePadding: true,
    label: "Product Image",
    reorder: false,
  },
  {
    id: "name", // This should match the 'sortby' value, e.g., 'name'
    numeric: false,
    disablePadding: false,
    label: "Product Name",
    reorder: true, // This column can be sorted
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Category",
    reorder: true, // This column can be sorted
  },
  {
    id: "variants",
    numeric: false,
    disablePadding: false,
    label: "Variants",
    reorder: false,
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    reorder: false,
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  // This now calls the prop handler, which will trigger an API call in the parent
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={
                headCell.reorder ? createSortHandler(headCell.id) : undefined
              }
              // Disable sorting if headCell.reorder is false
              hideSortIcon={!headCell.reorder}
              disabled={!headCell.reorder}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Products
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

// --- This is now a "Controlled Component" ---
export default function EnhancedTable({
  products,
  setIsUpdated,
  // --- New props for server-side state ---
  totalCommodities,
  page,
  rowsPerPage,
  order,
  orderBy,
  // --- New prop handlers to notify parent of changes ---
  onPageChange,
  onRowsPerPageChange,
  onRequestSort,
}) {
  // Local state for UI purposes is kept
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(true);
  const router = useRouter();

  // --- State for page, rowsPerPage, order, and orderBy is REMOVED ---

  // This handler now calls the prop passed from the parent
  const handleRequestSort = (event, property) => {
    // The parent component will handle setting the new order and orderBy
    onRequestSort(event, property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Selects all IDs *on the current page*
      const newSelected = products.map((n) => n._id); // Use _id or id
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // This handler now calls the prop passed from the parent
  const handleChangePage = (event, newPage) => {
    onPageChange(event, newPage);
  };

  // This handler now calls the prop passed from the parent
  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(event);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  // We use totalCommodities (total from server) instead of products.length
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCommodities) : 0;

  // --- The React.useMemo for 'visibleRows' is REMOVED ---
  // The 'products' prop is now the source of truth for the current page.

  const handleEdit = (e, productSlug) => {
    e.stopPropagation();
    router.push("/product/" + productSlug);
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteCommodities`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds: [productId] }),
        }
      );
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setIsUpdated((prev) => !prev);
      } else {
        throw new Error(jsonResponse);
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting product, check console!");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              // rowCount is the number of items on the current page
              rowCount={products.length}
            />
            <TableBody>
              {/* We map over 'products' directly. This is now the paginated list from the server. */}
              {products.map((row, index) => {
                const isItemSelected = selected.includes(row._id); // Use _id or id
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)} // Use _id or id
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id} // Use _id or id
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.sku}</TableCell>
                    <TableCell align="left">
                      <Image
                        src={row.variants[0].images[0]}
                        width={80}
                        height={80}
                        alt={row.name + "-image"}
                        className="w-16 h-16 object-cover"
                      />
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                    <TableCell align="left">{row.variants.length}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Click to Edit">
                        <IconButton
                          aria-label="edit"
                          onClick={(e) => handleEdit(e, row.slug)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => handleDelete(e, row._id)} // Use _id or id
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          // --- Pagination props are now controlled by the parent ---
          count={totalCommodities}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
