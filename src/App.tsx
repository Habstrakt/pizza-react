import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";

import Pizza from "./pages/ProductPage.tsx";
import Cart from "./pages/CartPage.tsx";
import Checkout from "./pages/Checkout.tsx";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="row">
            <Routes>
              <Route path="/pizza-react" element={<Pizza />} />
              <Route path="/pizza-react/cart" element={<Cart />} />
              <Route path="/pizza-react/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
