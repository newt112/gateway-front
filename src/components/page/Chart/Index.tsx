import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import AllAreaSummaryCard from "#/components/block/AllAreaSummaryCard";
import ExhibitListTableCard from "#/components/block/ExhibitListTableCard.tsx";
import { Grid } from "@mui/material";

const ChartIndex = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "滞在状況" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AllAreaSummaryCard />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ExhibitListTableCard />
      </Grid>
    </Grid>
  );
};

export default ChartIndex;
