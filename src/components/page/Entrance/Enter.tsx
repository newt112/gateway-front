import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
import { reservationState } from "#/recoil/reservation";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  MobileStepper,
  SwipeableDrawer,
  Grid,
  Typography,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Box,
  LinearProgress,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import {
  getTimePart,
  guestIdValidation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import MessageDialog from "#/components/block/MessageDialog";

const EntranceEnter = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const reservation = useRecoilValue(reservationState);
  const resetReservation = useResetRecoilState(reservationState);
  const [guestList, setGuest] = useState<string[]>([]);
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "エントランス入場処理" });
  }, []);

  useEffect(() => {
    // reserve-checkのフローを経ていない場合はreserve-checkのページに遷移させる
    if (!reservation || reservation.reservation_id === "") {
      navigate("/entrance/reserve-check", { replace: true });
    }
  }, [reservation]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const handleScan = (scanText: string | null) => {
    if (reservation && scanText && profile) {
      setText(scanText);
      if (guestIdValidation(scanText)) {
        if (!reservation.registered.includes(scanText)) {
          if (!guestList.some((guest) => guest === scanText)) {
            setSmDrawerStatus(true);
            setGuest([...guestList, scanText]);
            setScanStatus("success");
            setActiveStep(guestList.length);
          }
        } else {
          console.log(`${scanText}はすでに登録済みです。`);
        }
      } else {
        console.log(`${scanText}というゲストは存在しません。`);
      }
    }
  };

  const postApi = () => {
    setLoading(true);
    if (token && reservation) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .guest.register.$post({
          body: {
            reservation_id: reservation.reservation_id,
            guest_type: reservation.guest_type,
            guest_id: guestList,
            part: reservation.part,
          },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          resetReservation();
          setDeviceState(true);
          setText("");
          setScanStatus("waiting");
          setSmDrawerStatus(false);
          setDialogOpen(true);
          setDialogMessage(`${guestList.join(",")}の登録が完了しました。`);
        })
        .catch((err: AxiosError) => {
          console.log(err.message);
          setText("");
          setDeviceState(true);
          setSmDrawerStatus(false);
        });
    }
    setLoading(false);
  };

  const retry = (activeStep: number) => {
    setDeviceState(true);
    setText("");
    setScanStatus("waiting");
    setSmDrawerStatus(false);
    if (activeStep === 0) {
      setGuest([]);
    } else {
      const newGuestList = guestList;
      setGuest(newGuestList.splice(activeStep - 1, 1));
    }
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
    }
  };

  const onDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage("");
    navigate("/entrance/reserve-check", { replace: true });
  };

  const GuestInfoCard = () => {
    return (
      <>
        {reservation && guestList.length !== 0 && (
          <>
            <MobileStepper
              variant="dots"
              steps={reservation.count - reservation.registered.length}
              position="static"
              activeStep={activeStep}
              sx={{ flexGrow: 1 }}
              nextButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                  }
                  disabled={activeStep === guestList.length - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                  }
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h4">
                ゲスト情報 ( {activeStep + 1} 人目 /{" "}
                {reservation.count - reservation.registered.length} 人中 )
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIndRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>{guestList[activeStep]}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupWorkRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>{reservation.guest_type === "family" ? "保護者" : "その他"}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>{getTimePart(reservation.part).part_name}</ListItemText>
                </ListItem>
              </List>
              <Box
                m={1}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <Button variant="outlined" onClick={() => retry(activeStep)}>
                  スキャンし直す
                </Button>
              </Box>
            </Card>
            <Box
              m={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem",
              }}
            >
              <Button variant="outlined" onClick={() => retry(0)}>
                全てスキャンし直す
              </Button>
              <Button variant="contained" onClick={postApi}>
                登録
              </Button>
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <Typography variant="h3">リストバンド登録</Typography>
              <Typography variant="body1">
                登録するリストバンドのQRコードをスキャンしてください。
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="guest" onClose={onNumPadClose} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Scanner handleScan={handleScan} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" sx={{ whiteSpace: "noWrap" }}>ゲストID:</Typography>
            <FormControl sx={{ m: 1, flexGrow: 1 }} variant="outlined">
              <OutlinedInput
                type="text"
                size="small"
                value={text}
                onChange={(e) => setText(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="ゲストIDをコピー"
                      onClick={() => {
                        if (text !== "") {
                          navigator.clipboard
                            .writeText(text)
                            .catch((e) => console.log(e));
                        }
                      }}
                      edge="end"
                    >
                      <ContentCopyRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                }
                disabled
                fullWidth
              />
            </FormControl>
          </Box>
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          {scanStatus !== "waiting" &&
            (largerThanSM ? (
              <GuestInfoCard />
            ) : (
              <SwipeableDrawer
                anchor="bottom"
                open={smDrawerOpen}
                onClose={() => retry(0)}
                onOpen={() => setSmDrawerStatus(true)}
              >
                <GuestInfoCard />
              </SwipeableDrawer>
            ))}
        </Grid>
        <MessageDialog
          open={dialogOpen}
          type="success"
          title="処理が完了しました"
          message={[dialogMessage]}
          onClose={onDialogClose}
        />
      </Grid>
    </>
  );
};

export default EntranceEnter;
