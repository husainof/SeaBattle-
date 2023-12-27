import shipImg from "../assets/pngwing-h.png";
import Ship from "../models/Ship";
import Game from "../models/Game";

interface DockProps {
  setClick: (x: number, y: number) => void;
  tShip: Ship | undefined;
  setShip: (ship: Ship) => void;
}

export default function Dock({ setClick, tShip, setShip }: DockProps) {
  const dock = Game().dock;

  return (
    <div
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        setClick(e.clientX, e.clientY);
      }}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <img
        onClick={() => {
          console.log(dock.shipsOneDesk());
          if (dock.shipsOneDesk().length != 0 && !tShip) {
            const ship = dock.shipsOneDesk().pop();
            console.log("in dock", ship);
            setShip(ship);
          } else null;
        }}
        width={40}
        height={35}
        src={shipImg}
      />
      {"x" + dock.shipsOneDesk().length}
      <img
        onClick={() => {
          if (dock.shipsTwoDesk().length != 0 && !tShip) {
            setShip(dock.shipsTwoDesk().pop());
          } else null;
        }}
        width={80}
        height={35}
        src={shipImg}
      />
      {"x" + dock.shipsTwoDesk().length}
      <img
        onClick={() => {
          if (dock.shipsThreeDesk().length != 0 && !tShip) {
            setShip(dock.shipsThreeDesk().pop());
          } else null;
        }}
        width={120}
        height={35}
        src={shipImg}
      />
      {"x" + dock.shipsThreeDesk().length}
      <img
        onClick={() => {
          if (dock.shipsFourDesk().length != 0 && !tShip) {
            setShip(dock.shipsFourDesk().pop());
          } else null;
        }}
        width={150}
        height={40}
        src={shipImg}
      />
      {"x" + dock.shipsFourDesk().length}
    </div>
  );
}
