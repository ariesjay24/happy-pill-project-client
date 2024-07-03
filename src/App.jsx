import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import routes from "./routes";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                exact
              />
            );
          })}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
