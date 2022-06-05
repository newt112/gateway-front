import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import apiClient from "#/axios-config";

import {
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import MessageDialog from "./MessageDialog";
import { userTypeProp } from "#/components/functional/generalProps";
import { AxiosError } from "axios";

const CreateUserCard = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "管理者用" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [userIdValue, setUserId] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [displayNameValue, setDisplayName] = useState("");
  const [userTypeValue, setUserType] = useState<userTypeProp>("exhibit");
  const [loading, setLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogMessage, setMessageDialogMessage] = useState<string[]>([]);
  const [createHistory, setCreateHistory] = useState<
    { user_id: string; display_name: string; user_type: string }[]
  >([]);

  const userTypeList: { value: userTypeProp; label: string; }[] = [
    { value: "executive", label: "文化祭実行委員" },
    { value: "exhibit", label: "展示担当者" },
    { value: "analysis", label: "データ分析" },
  ];

  // 過去に自分が作成したユーザーのリスト
  useEffect(() => {
    if (token) {
      async (token: string) => {
        const user = await apiClient(
          process.env.REACT_APP_API_BASE_URL
        ).admin.user.created_by_me.$get({
          headers: { Authorization: `Bearer ${token}` },
        });
        if (user.length !== 0) {
          setCreateHistory([...createHistory, ...user]);
        }
      };
    }
  }, [token]);

  const createUser = () => {
    if (token && !loading) {
      setLoading(true);
      if (
        userIdValue === "" ||
        displayNameValue === "" ||
        userIdValue.length > 10 ||
        displayNameValue.length > 20
      ) {
        setDialogType("error");
        setMessageDialogMessage([
          userIdValue === "" ? "ユーザーidを入力してください。" : "",
          displayNameValue === "" ? "表示名を入力してください。" : "",
          userIdValue.length > 10
            ? "ユーザーidは10字以内で設定してください。"
            : "",
          displayNameValue.length > 20
            ? "表示名は10字以内で設定してください。"
            : "",
        ]);
        setLoading(false);
        setShowMessageDialog(true);
        return;
      }
      const payload = {
        user_id: userIdValue,
        password: passwordValue,
        display_name: displayNameValue,
        user_type: userTypeValue,
      };
      console.log(payload);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .admin.user.create.$post({
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        })
        .then(() => {
          setCreateHistory([
            ...createHistory,
            {
              user_id: userIdValue,
              display_name: displayNameValue,
              user_type: userTypeValue,
            },
          ]);
          setDialogType("success");
          setMessageDialogMessage([
            `ユーザーアカウント( ${userIdValue} ) の作成が完了しました。`,
          ]);
          setShowMessageDialog(true);
        })
        .catch((err: AxiosError) => {
          console.log(err);
          setDialogType("error");
          setMessageDialogMessage([err.message]);
          setShowMessageDialog(true);
        });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowMessageDialog(false);
    setMessageDialogMessage([]);
  };

  return (
    <>
      <Typography variant="h3">ユーザーの作成</Typography>
      <TextField
        id="user_id"
        label="ユーザーid"
        type="text"
        value={userIdValue}
        error={userIdValue.length > 10}
        helperText={
          userIdValue.length > 10 && "ユーザーidは10字以内で設定してください。"
        }
        onChange={(e) => setUserId(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="password"
        label="パスワード"
        type="text"
        value={passwordValue}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="displayName"
        label="表示名"
        type="text"
        value={displayNameValue}
        error={displayNameValue.length > 20}
        helperText={
          displayNameValue.length > 20 && "表示名は10字以内で設定してください。"
        }
        onChange={(e) => setDisplayName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="userType"
        label="種別"
        select
        value={userTypeValue}
        onChange={(e) => setUserType(e.target.value as userTypeProp)}
        margin="normal"
        fullWidth
      >
        {userTypeList.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button
          onClick={createUser}
          disabled={loading}
          variant="contained"
          startIcon={loading && <CircularProgress size={24} />}
        >
          作成
        </Button>
      </Box>
      <MessageDialog
        open={showMessageDialog}
        type={dialogType}
        message={dialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default CreateUserCard;
