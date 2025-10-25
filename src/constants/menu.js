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
    href: "/product/add",
  },
  {
    id: "bulk-upload",
    label: "Bulk Upload",
    icon: InboxIcon,
    href: "/bulk-upload",
  },
  {
    id: "actions",
    label: "Actions",
    icon: InboxIcon,
    href: "/bulk-upload",
  },
];
