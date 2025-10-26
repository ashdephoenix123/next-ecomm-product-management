import AddIcon from "@mui/icons-material/Add";
import AppsIcon from "@mui/icons-material/Apps";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import SettingsIcon from "@mui/icons-material/Settings";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

export const sidebarMenu = [
  {
    id: "all-products",
    label: "All Products",
    icon: DynamicFormIcon,
  },
  {
    id: "add-new-product",
    label: "Add New Product",
    icon: AddIcon,
  },
  {
    id: "bulk-upload",
    label: "Bulk Upload",
    icon: StickyNote2Icon,
  },
  {
    id: "categories",
    label: "Categories",
    icon: AppsIcon,
    options: [
      {
        id: "category1",
        label: "Category 1",
        icon: SignalCellularAlt1BarIcon,
      },
      {
        id: "category2",
        label: "Category 2",
        icon: SignalCellularAlt2BarIcon,
      },
      {
        id: "category3",
        label: "Category 3",
        icon: SignalCellularAltIcon,
      },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    icon: SettingsIcon,
  },
];
