import React from "react";
import styles from "./Pizza.module.css";

import ProductList from "../components/ProductList";

const Pizza: React.FC = () => {
  return (
    <>
      <div id="wrapper">
        <div className="col-md-12">
          <section className={styles.mainStyle}>
            <ProductList />
          </section>
        </div>
      </div>
    </>
  );
};

export default Pizza;
