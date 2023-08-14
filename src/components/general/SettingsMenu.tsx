import * as React from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useHotkeys } from "react-hotkeys-hook";

import { useAuth } from "@/context/AuthContext";
import ThemeMenuItem from "@/components/general/ThemeMenuItem";
import SettingMenuIcon from "@/components/general/SettingMenuIcon";

export default function SettingsMenu() {
	const { logout, user } = useAuth();
	const buttonRef = React.useRef<HTMLButtonElement | null>(null);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleItemClick = (cb?: () => void) => {
		setAnchorEl(null);
		cb?.();
	};

	useHotkeys(
		"shift+s",
		() => {
			if (!anchorEl) {
				buttonRef.current?.click();
			} else {
				setAnchorEl(null);
			}
		},
		undefined,
		[anchorEl]
	);

	return (
		<React.Fragment>
			<Tooltip title="Settings">
				<IconButton
					onClick={handleClick}
					size="medium"
					sx={{ ml: 2 }}
					aria-controls={open ? "settings-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
					ref={buttonRef}
				>
					<SettingMenuIcon />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				id="settings-menu"
				open={open}
				onClose={() => handleItemClick()}
				onClick={() => handleItemClick()}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
						minWidth: 180,
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem onClick={() => handleItemClick()}>
					{!user ? (
						<React.Fragment>
							<Avatar /> Profile
						</React.Fragment>
					) : (
						<React.Fragment>
							<Box sx={{ display: "flex", flexDirection: "column" }}>
								<Typography fontSize={12} color="grey">
									Profile
								</Typography>
								<Typography fontSize={12} color="grey">
									{user.email}
								</Typography>
							</Box>
						</React.Fragment>
					)}
				</MenuItem>
				<Divider />
				<ThemeMenuItem handleItemClick={handleItemClick} />
				{user ? (
					<React.Fragment>
						<Divider sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
						<MenuItem onClick={() => handleItemClick(logout)}>
							<ListItemIcon>
								<LogoutIcon fontSize="small" />
							</ListItemIcon>
							Logout
						</MenuItem>
					</React.Fragment>
				) : null}
			</Menu>
		</React.Fragment>
	);
}