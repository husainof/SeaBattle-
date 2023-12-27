import { Outlet } from "react-router-dom";
import { Window } from "./Auth";
import styled from "styled-components";

const WindowSettings = styled(Window)`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

export default function Settings() {
  return (
    <WindowSettings>
      <Outlet />
    </WindowSettings>
  );
}
