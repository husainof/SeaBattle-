import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  InputLabel,
} from "@mui/material";
import { AvatarTypes } from "../models/Avatars";

interface ModalProps {
  setAvatar: (id: number) => void;
  open: boolean;
  onClose: () => void;
}

const AvatarSelectionModal: React.FC<ModalProps> = ({
  open,
  onClose,
  setAvatar,
}) => {
  const handleAvatarClick = (avatarName: string) => {
    setAvatar(AvatarTypes.indexOf(avatarName));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Аватар игрока</DialogTitle>
      <DialogContent>
        <InputLabel>Выберите аватар:</InputLabel>
        <Box>
          {Object.values(AvatarTypes).map((avatarImg) => (
            <IconButton onClick={() => handleAvatarClick(avatarImg)}>
              {avatarImg ? <img width={150} src={avatarImg} /> : null}
            </IconButton>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ display: "block" }} onClick={onClose}>
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarSelectionModal;
