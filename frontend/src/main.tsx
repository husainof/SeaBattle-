import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.tsx";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Auth, Login, Register } from "./routes/Auth.tsx";
import About from "./routes/About.tsx";
import Settings from "./routes/Settings.tsx";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";
import PrivatePath from "./routes/PrivatePath.tsx";
import SelectMode from "./routes/SelectMode.tsx";
import SelectLevel from "./routes/SelectLevel.tsx";
import ShipEditor from "./routes/ShipEditor.tsx";
import { RouteNames } from "./routes/router/index.ts";
import Battle from "./routes/Battle.tsx";
import CreateNetworkGame from "./routes/CreateNetworkGame.tsx";
import Waiting from "./routes/Waiting.tsx";
import { ChakraProvider } from "@chakra-ui/react";

const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
`;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<Root />}>
        {/* Авторизация */}
        <Route element={<Auth />}>
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTER} element={<Register />} />
        </Route>

        {/* Приватные роуты */}
        <Route element={<PrivatePath />}>
          <Route element={<Settings />}>
            <Route index element={<SelectMode />} />
            <Route path={RouteNames.SET_LEVEL} element={<SelectLevel />} />
            <Route
              path={RouteNames.GEN_NET_GAME}
              element={<CreateNetworkGame />}
            />
            <Route path={RouteNames.WAITING} element={<Waiting />} />
          </Route>
          <Route path={RouteNames.EDIT} element={<ShipEditor />} />
          <Route path={RouteNames.BATTLE} element={<Battle />} />
        </Route>
      </Route>
      {/* Спрвка открыватся в новой вкладке */}
      {/* <Route path={RouteNames.INFO} element={<About />} /> */}
    </Route>
  )
);

export const theme = {
  primaryColor: "bisque",
  backgroundColor: "beige",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider theme={theme}>
      {/* <Provider store={store}> */}
      <RouterProvider router={router} />
      <GlobalStyles />
      {/* </Provider> */}
    </ThemeProvider>
  </>
);
