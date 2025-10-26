import Actions from "@/components/Actions";
import AddProductPage from "@/components/AddProduct";
import AllProducts from "@/components/all-products/Allproducts";
import BulkUploads from "@/components/bulk-uploads/Bulkuploads";
import Category1 from "@/components/categories/Category1";
import Category2 from "@/components/categories/Category2";
import Category3 from "@/components/categories/Category3";
import Dashboard from "@/components/dashboard/MainDashboard";
import { sidebarMenu } from "@/constants/menu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Collapse } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";

const drawerWidth = 240;

const ListsWithOptions = ({ menu, setactiveTab, activeTab }) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <menu.icon />
        </ListItemIcon>
        <ListItemText primary={menu.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menu.options.map((option) => (
            <ListItemButton
              sx={{ pl: 4 }}
              key={option.id}
              onClick={() => setactiveTab(option)}
              selected={activeTab.id === option.id}
            >
              <ListItemIcon>
                <option.icon />
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

function ResponsiveDrawer(props) {
  const { window } = props;
  const router = useRouter();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [activeTab, setactiveTab] = React.useState(sidebarMenu[0]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      {/* --- MODIFIED: Added Logo inside Toolbar --- */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Image
          src={"/5.png"}
          alt="Company Logo"
          width={180} // Adjust to your logo's width
          height={40} // Adjust to your logo's height
          style={{ objectFit: "contain" }}
        />
      </Toolbar>
      {/* --- END OF MODIFICATION --- */}
      <Divider />
      <List>
        {sidebarMenu.map((menu, index) => {
          if (Object.keys(menu).includes("options")) {
            return (
              <ListsWithOptions
                key={menu.id}
                menu={menu}
                setactiveTab={setactiveTab}
                activeTab={activeTab}
              />
            );
          } else
            return (
              <ListItem key={menu.id} disablePadding>
                <ListItemButton
                  onClick={() => setactiveTab(menu)}
                  selected={activeTab.id === menu.id}
                >
                  <ListItemIcon>
                    <menu.icon />
                  </ListItemIcon>
                  <ListItemText primary={menu.label} />
                </ListItemButton>
              </ListItem>
            );
        })}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.secondary.main,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {activeTab.id === "dashboard" && <Dashboard />}
        {activeTab.id === "all-products" && <AllProducts />}
        {activeTab.id === "add-new-product" && <AddProductPage />}
        {activeTab.id === "bulk-upload" && <BulkUploads />}
        {activeTab.id === "category1" && <Category1 />}
        {activeTab.id === "category2" && <Category2 />}
        {activeTab.id === "category3" && <Category3 />}
        {activeTab.id === "actions" && <Actions />}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
