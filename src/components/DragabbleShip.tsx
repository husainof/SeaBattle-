import { useEffect, useState } from "react";
import Ship, { ShipDirection } from "../models/Ship";

interface ShipProps {
  coord: { x: number; y: number };
  onHold: boolean;
  ship: Ship | undefined;
  toVertical: () => void;
  toHorizontal: () => void;
}

export default function DragabbleShip({
  coord,
  onHold,
  toVertical,
  toHorizontal,
  ship,
}: ShipProps) {
  const [isChange, setChange] = useState<boolean>(false);
  const [imagePosition, setImagePosition] = useState({
    x: coord.x,
    y: coord.y,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setImagePosition({ x: clientX, y: clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isChange, onHold]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") {
        console.log("Нажата клавиша стрелки влево");
        toVertical();
      } else if (event.code === "ArrowRight") {
        // Обработка события нажатия клавиши стрелки вправо
        console.log("Нажата клавиша стрелки вправо");
        toHorizontal();
      }
      setChange((s) => !s);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <img
      height={ship?.Icon?.height}
      width={ship?.Icon?.width}
      src={ship?.Icon?.icon}
      style={{
        zIndex: 20,
        position: "absolute",
        left: imagePosition.x + 1,
        top: imagePosition.y + 1,
      }}
    />
  );
}
