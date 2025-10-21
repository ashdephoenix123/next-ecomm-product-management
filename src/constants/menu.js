import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export const sidebarMenu = [
  {
    id: "all-products",
    label: "All Products",
    icon: MailIcon,
    href: "/all-products",
  },
  {
    id: "add-new-product",
    label: "Add New Product",
    icon: MailIcon,
    href: "/",
  },
  {
    id: "bulk-upload",
    label: "Bulk Upload",
    icon: InboxIcon,
    href: "/bulk-upload",
  },
  { id: "log-out", label: "Log Out", icon: InboxIcon, href: "/log-out" },
];
