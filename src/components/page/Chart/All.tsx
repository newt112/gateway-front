import React, { useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import { exhibitListState } from "#/recoil/exhibit";

import {
  Grid,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const ChartAll = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "全体の滞在状況" });
  }, []);

  const AllAreaSummaryCard = () => {
    return (
      <>
        <Typography variant="h3">アウトライン</Typography>
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemText>構内滞在者数 {}人</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </>
    );
  };

  const ExhibitListCard = () => {
    const navigate = useNavigate();
    const exhibitList = useRecoilValue(exhibitListState);
    return (
      <>
        {exhibitList.map((exhibit) => (
          <ListItem key={exhibit.exhibit_id}>
            <ListItemButton
              onClick={() =>
                navigate(`/chart/exhibit/${exhibit.exhibit_id}`, {
                  replace: true,
                })
              }
            >
              <ListItemText primary={exhibit.exhibit_name} />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <AllAreaSummaryCard />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="h3">展示別</Typography>
          <List dense={true}>
            <Suspense fallback={<p>読込中...</p>}>
              <ExhibitListCard />
            </Suspense>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartAll;
