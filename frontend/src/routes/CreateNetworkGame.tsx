import {
  Alert,
  Box,
  Button,
  Divider,
  Input,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { RouteNames } from "./router";
import { useNavigate } from "react-router-dom";
import Connector from "../socket";

export default function CreateNetworkGame() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { generateSession, connectSession, onSessionStart } = Connector();
  useEffect(() => {
    onSessionStart((info) => {
      if (info) {
        localStorage.setItem("sessionId", code);
        navigate(RouteNames.EDIT);
      } else {
        console.log("нет такого кода сессии");
        setOpen(true);
      }
    });
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Игра по сети</Typography>
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.trim())}
        placeholder="Введите код игры"
      />
      <Button
        disabled={code == "" || isNaN(Number(code)) || code?.length !== 18}
        variant="contained"
        onClick={() => {
          const name = localStorage.getItem("username");
          if (name) {
            connectSession(code, name);
          }
        }}
      >
        Войти
      </Button>
      <Divider />
      <Button
        variant="contained"
        onClick={() => {
          const name = localStorage.getItem("username");
          if (name) {
            generateSession(name);
          }
          navigate(RouteNames.WAITING);
        }}
      >
        Создать игру
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", backgroundColor: "#ec224b" }}
        >
          Игры с таким номером не существует
        </Alert>
      </Snackbar>
    </Box>
  );
}
