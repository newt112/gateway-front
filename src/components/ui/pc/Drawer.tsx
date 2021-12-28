import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Toolbar, List, ListSubheader, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import UserInfo from '../UserInfo';
const drawerWidth = 240;

const DrawerLeft = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h1" sx={{ color: 'primary.main' }}>Gateway</Typography>
            </Toolbar>
            <Divider />
            <UserInfo />
            <Divider />
            <List>
                <ListItemButton selected={path === '/'}
                    onClick={() => navigate('/')}>
                    <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                    <ListItemText primary='ホーム' />
                </ListItemButton>
            </List>
            <Divider />
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    展示企画
                </ListSubheader>
            }>
                <ListItemButton selected={/exhibit\/enter/.test(path)}
                    onClick={() => navigate('/exhibit/enter')}>
                    <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                    <ListItemText primary='入室スキャン' />
                </ListItemButton>
                <ListItemButton selected={/exhibit\/exit/.test(path)}
                    onClick={() => navigate('/exhibit/exit')}>
                    <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                    <ListItemText primary='退室スキャン' />
                </ListItemButton>
                <ListItemButton selected={/exhibit\/pass/.test(path)}
                    onClick={() => navigate('/exhibit/pass')}>
                    <ListItemIcon><ArrowRightAltRoundedIcon /></ListItemIcon>
                    <ListItemText primary='通過スキャン' />
                </ListItemButton>
            </List>
            <Divider />
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    エントランス
                </ListSubheader>
            }>
                <ListItemButton selected={/entrance\/reserve-check/.test(path)}
                    onClick={() => navigate('/entrance/reserve-check')}>
                    <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                    <ListItemText primary='入場スキャン' />
                </ListItemButton>
                <ListItemButton selected={/entrance\/exit/.test(path)}
                    onClick={() => navigate('/entrance/exit')}>
                    <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                    <ListItemText primary='退場スキャン' />
                </ListItemButton>
            </List>
        </Drawer >
    );
}

export default DrawerLeft;