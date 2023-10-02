import React, { useState } from "react";
import styles from "./ProductList.module.css";
import classNames from "classnames";
import foodsData from "../assets/foods.json";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { addProductToCart, setProductsLS } from "../redux/pizzaSlice";

import SizeButtons from "./SizeButtons";

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  sizes: number[];
  prices: number[];
  selectedSize: number;
  selectedPrice: number;
  quantity: number;
}

interface ProductCart {
  id: number;
  name: string;
  imageUrl: string;
  selectedSize: number;
  selectedPrice: number;
  quantity: number;
}

const categoryProducts = [
  { id: 1, name: "Все" },
  { id: 2, name: "Пицца" },
  { id: 3, name: "Закуски" },
  { id: 4, name: "Напитки" },
];

const ProductList: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedSizesAndPrices, setSelectedSizesAndPrices] = useState<{
    [itemId: number]: { size: number; price: number };
  }>({});

  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  const localStorageData = JSON.parse(localStorage.getItem("cart"));

  const handleSizeBtn = (
    selectedSize: number,
    itemId: number,
    selectedPrice: number,
  ) => {
    setSelectedSizesAndPrices((prevState) => ({
      ...prevState,
      [itemId]: { size: selectedSize, price: selectedPrice },
    }));
  };

  useEffect(() => {
    if (localStorageData) {
      dispatch(setProductsLS(localStorageData));
    }
    setSelectedCategory("Все");
  }, []);

  useEffect(() => {
    setProducts(getCategoryProducts());
  }, [selectedCategory]);

  const getCategoryProducts = () => {
    return foodsData.products.filter(
      (item) =>
        selectedCategory === "Все" || item.category === selectedCategory,
    );
  };

  const handleAddCart = (item: ProductCart) => {
    dispatch(
      addProductToCart({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        selectedSize: item.selectedSize,
        selectedPrice: item.selectedPrice,
        quantity: 1,
      }),
    );
  };

  return (
    <div>
      <ul className={styles.ul}>
        {categoryProducts.map((category, index) => (
          <li
            key={index}
            className={classNames("menu-item", styles.li)}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
      <section className={styles.section}>
        <div className="row">
          {getCategoryProducts().map((item, index) => (
            <div
              key={index}
              className={classNames(
                styles.productCard,
                "col-lg-3 col-md-4 col-sm-6",
              )}
            >
              <div className={styles.productImg}>
                <img className={styles.img} alt="" src={item.imageUrl} />
              </div>
              <div className="product-info">
                <span className={styles.productTitle}>{item.name}</span>
                <div className={styles.productDescription}>
                  {item.description}
                </div>

                <SizeButtons
                  sizes={item.sizes}
                  prices={item.prices}
                  productId={item.id}
                  onSizeSelected={handleSizeBtn}
                />
              </div>
              <div className={classNames(styles.productFooter, "mt-3")}>
                <div key={index} className="product-price">
                  <span>
                    {selectedSizesAndPrices[item.id]?.price || item.prices[0]}
                    рублей
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-danger position-relative"
                  onClick={() =>
                    handleAddCart({
                      ...item,
                      selectedSize: selectedSizesAndPrices[item.id]?.size,
                      selectedPrice: selectedSizesAndPrices[item.id]?.price,
                    })
                  }
                >
                  + Добавить
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductList;
