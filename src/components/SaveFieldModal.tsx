import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
} from "@mui/material";
import Game from "../models/Game";
import BASE_URL from "../serer";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const SaveFieldModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState<string>("");
  const ships = Game().myField.ships;

  const username = localStorage.getItem("username");
  const save = async () => {
    try {
      const response = await fetch(BASE_URL + `Arrangements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          playerName: username,
          ships: ships.map((ship) => ({
            id: ship.Id,
            x: ship.X,
            y: ship.Y,
            length: ship.Length,
            direction: ship.Direction,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const error = await response.json();
        console.error("Ошибка при входе:", error.error);
        // Дополнительные действия по обработке ошибки входа
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      // Дополнительные действия по обработке ошибки входа
    }
  };

  const onClick = () => {
    if (title.trim() !== "") {
      save();
      setTitle("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Сохранение расстановки</DialogTitle>
      <DialogContent>
        <InputLabel>Введите название расстановки:</InputLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button sx={{ display: "block" }} onClick={() => onClick()}>
          Сохранить
        </Button>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default SaveFieldModal;
