import { ListItemButton, ListItemIcon } from "@mui/material";
import Link from "next/link";
import colorConfigs from "./configs/colorConfigs";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
  item: RouteType;
};

const NavBarItem = ({ item }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);

  return (
    item.sidebarProps && item.path ? (
      <Link href={item.path} passHref>
        <ListItemButton
          sx={{
            "&:hover": {
              backgroundColor: colorConfigs.sidebar.hoverBg
            },
            backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
            paddingY: "12px",
            paddingX: "24px"
          }}
        >
          <ListItemIcon sx={{ color: colorConfigs.sidebar.color }}>
            {item.sidebarProps.icon}
          </ListItemIcon>
          {item.sidebarProps.displayText}
        </ListItemButton>
      </Link>
    ) : null
  );
};

export default NavBarItem;
