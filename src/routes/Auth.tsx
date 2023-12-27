import styled from "styled-components";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AvatarSelectionModal from "../components/AvatarSelectionModal";
import { RouteNames } from "./router";
import {
  Alert,
  Button,
  Input,
  InputLabel,
  Snackbar,
  Typography,
} from "@mui/material";
import BASE_URL from "../serer";
import { ChakraProvider, Toast, useToast } from "@chakra-ui/react";

export const Window = styled.div`
  border: 1px solid;
  border-radius: 10px;
  padding: 2em;
  background-color: ${(props) => props.theme.primaryColor};
`;

export function Auth() {
  return (
    <Window>
      <Outlet />
    </Window>
  );
}

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onClick = async () => {
    localStorage.setItem("username", username);
    try {
      const response = await fetch(BASE_URL + `Users/login?login=${username}`);
      console.log(username);

      if (response.ok) {
        console.log("успешный логин");
        navigate(RouteNames.SET_MODE);
      } else {
        const error = await response.json();
        console.log(error.status);
        if (error.status === 401) {
          console.log(error.status);
          setOpen(true);
        }
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      // Дополнительные действия по обработке ошибки входа
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Typography variant="h3">Вход</Typography>
      <form>
        <p>
          <InputLabel>Введите логин:</InputLabel>
          <Input onChange={(e) => setUsername(e.target.value)} />
        </p>
        <Button sx={{ mt: 2, mb: 2 }} variant="contained" onClick={onClick}>
          Войти
        </Button>
      </form>

      <Link to={RouteNames.REGISTER}>
        <Typography>Зарегистрироваться</Typography>
      </Link>
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
          Такого пользователя не существует
        </Alert>
      </Snackbar>
    </>
  );
}

export function Register() {
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<number>(0);
  const onClick = async () => {
    localStorage.setItem("username", username);
    try {
      const response = await fetch(
        BASE_URL + `Users/register?login=${username}&avatarType=${avatar}`
      );
      console.log(username, avatar);

      if (response.ok) {
        console.log("успешная регистрация");
        navigate(RouteNames.SET_MODE);
      } else {
        const error = await response.json();
        if (error.status === 400) {
          setOpen(true);
        }
      }
    } catch (error) {
      setOpen(true);
    }
  };
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Typography variant="h3">Регистрация</Typography>
      <form>
        <p>
          <InputLabel>Введите логин:</InputLabel>
          <Input onChange={(e) => setUsername(e.target.value)} />
        </p>
        <Button
          sx={{ mt: 2, mb: 2 }}
          variant="contained"
          onClick={handleOpenModal}
        >
          Выбрать аватар
        </Button>
        <AvatarSelectionModal
          setAvatar={(id) => setAvatar(id)}
          open={openModal}
          onClose={handleCloseModal}
        />
      </form>
      <Button onClick={onClick}>К игре</Button>
      <Link to={RouteNames.LOGIN}>
        <Typography>Уже зарегитрировались?</Typography>
      </Link>
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
          Игрок с таким логином уже существует
        </Alert>
      </Snackbar>
    </>
  );
}
