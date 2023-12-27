import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import Connector from "../socket";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "./router";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

function Waiting() {
  const navigate = useNavigate();
  const { cancelSession, onGameInfo, onSessionStart } = Connector();
  const [message, setMessage] = useState("");
  useEffect(() => {
    onGameInfo((info) => setMessage(info));
    onSessionStart((info) => {
      if (info) {
        localStorage.removeItem("sessionId");
        localStorage.setItem("sessionId", message);
        navigate(RouteNames.EDIT);
      }
    });
  });

  const [open, setOpen] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5">Номер вашей игры:</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>{message}</Typography>
        <IconButton onClick={handleCopyClick} aria-label="Скопировать">
          <FileCopyOutlinedIcon />
        </IconButton>
      </Box>
      <Typography variant="h6">Ожидайте подключения соперника</Typography>
      <Button
        variant="contained"
        onClick={() => {
          cancelSession(message);
          navigate(RouteNames.GEN_NET_GAME);
        }}
      >
        Отменить создание игры
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Скопировано в буфер обмена"
      />
    </Box>
  );
}

export default Waiting;
