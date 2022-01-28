import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '#/stores/index';
import { setPageInfo } from '#/stores/page';

import { Grid, Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export default function ChartAll() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const exhibitList = useSelector((state: RootState) => state.exhibit).list;

    useEffect(() => {
        dispatch(setPageInfo({ title: "全体の滞在状況" }));
    }, []);

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
                <Grid container>
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                            <Typography variant="h3">アウトライン</Typography>
                            <List>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemText>構内滞在者数 { }人</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Typography variant="h3">展示別</Typography>
                    <List dense={true}>
                        {exhibitList.map((exhibit) =>
                        (<ListItem key={exhibit.exhibit_id}>
                            <ListItemButton onClick={(e: any) => navigate(`/chart/exhibit/${exhibit.exhibit_id}`, { replace: true })}>
                                <ListItemText
                                    primary={exhibit.exhibit_name}
                                />
                            </ListItemButton>
                        </ListItem>)
                        )}
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
}