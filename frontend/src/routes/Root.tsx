import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";

export const RootWrapper = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
`;
export const RootInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100wh;
`;
const InfoIcon = styled.div`
  position: fixed;
  top: 1em;
  right: 1em;
`;

function Root() {
  return (
    <RootWrapper>
      <InfoIcon>
        <Link to="https://localhost:44306/главная справка.html" target="_blank">
          ?
        </Link>
      </InfoIcon>
      <RootInner>
        <Outlet />
      </RootInner>
    </RootWrapper>
  );
}

export default Root;
