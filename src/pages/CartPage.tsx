import React from "react";
import cartImage from "../assets/img/cart.png";
import styles from "./Cart.module.css";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  incrementQuantity,
  decrementQuantity,
  calculatedTotalPrice,
} from "../redux/pizzaSlice.tsx";

interface PizzaState {
  productsCart: {
    id: number;
    name: string;
    imageUrl: string;
    selectedSize: number[];
    selectedPrice: number[];
    quantity: number;
  }[];
}

interface PizzaRootState {
  pizza: PizzaState;
}

interface DeliveryState {
  deliveryInfo: {
    totalPrice: number;
  };
}

interface DeliveryRootState {
  pizza: DeliveryState;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  selectedSize: number[];
  selectedPrice: number[] | number;
  quantity: number;
}

const Cart: React.FC = () => {
  const dispatch = useDispatch();

  const productCart = useSelector(
    (state: PizzaRootState) => state.pizza.productsCart,
  );

  const totalPrice = useSelector(
    (state: DeliveryRootState) => state.pizza.deliveryInfo.totalPrice,
  );

  useEffect(() => {
    dispatch(calculatedTotalPrice());
  });

  function addItem(productId: number) {
    dispatch(incrementQuantity(productId));
  }

  function removeItem(productId: number) {
    dispatch(decrementQuantity(productId));
  }

  return (
    <>
      <div className="col-md-2 mt-5">
        <h1 className={styles.cartTitle}>Корзина</h1>
        <div className="maskot">
          <div className={styles.buble}>
            Проверь свой заказ и не забудь добавить вкусности!
          </div>
          <div className="logo">
            <img className={styles.logoImg} src={cartImage} alt="" />
          </div>
        </div>
      </div>
      {productCart.length > 0 ? (
        <div className="col-md-10 mt-5">
          <div className={styles.zakaz}>Состав заказа</div>
          <div className="cart_wrapper">
            <div className={styles.cartContent}>
              {productCart.map((product: Product, index: number) => (
                <div
                  key={index}
                  className={classNames("d-flex", styles.cartItem)}
                >
                  <div className={styles.img}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width="100"
                      height="100"
                    />
                  </div>
                  <div className={styles.meta}>
                    <div className={classNames("d-flex", styles.productName)}>
                      {product.name} -{" "}
                      {product.selectedSize ? product.selectedSize : ""}
                    </div>
                  </div>
                  <div className={classNames("d-flex", styles.quantity)}>
                    <div
                      onClick={() => removeItem(product.id)}
                      className={classNames(
                        "btn btn-danger d-flex",
                        styles.minus,
                      )}
                    >
                      -
                    </div>
                    <div className="quantity">
                      <p className={styles.count}>{product.quantity}</p>
                    </div>
                    <div
                      onClick={() => addItem(product.id)}
                      className={classNames(
                        "btn btn-danger d-flex",
                        styles.plus,
                      )}
                    >
                      +
                    </div>
                  </div>
                  <div className={styles.price}>
                    <span>
                      {(product.selectedPrice as number) * product.quantity} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={classNames("d-flex", styles.returnWrap)}>
              <Link to="/pizza-react" className={styles.return}>
                Вернуться в меню
              </Link>
            </div>
            <div className="checkout">
              <div className={styles.checkoutItem}>
                <div className={classNames("d-flex", styles.buttons)}>
                  <div className={styles.summ}>
                    К оплате:
                    <strong className={styles.totalPrice}>
                      {" "}
                      {totalPrice} ₽
                    </strong>
                  </div>
                  <Link
                    to="/pizza-react/checkout"
                    className={styles.checkoutCart}
                  >
                    Перейти к оформлению
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-10 mt-5">
          <p className={styles.emptyCart}>Ваша корзина пока пуста.</p>
          <Link
            to="/pizza-react"
            className={classNames("mx-auto", styles.return)}
          >
            Вернуться в меню
          </Link>
        </div>
      )}
    </>
  );
};

export default Cart;
