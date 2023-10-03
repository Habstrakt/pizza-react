import React, { ChangeEvent, useState, FormEvent } from "react";
import styles from "./Checkout.module.css";
import classNames from "classnames";
import cartImage from "../assets/img/cart.png";
import { useDispatch, useSelector } from "react-redux";
import InputMask from "react-input-mask";

import {
  updateDeliveryMethod,
  updatePaymentMethod,
  setClientName,
  setClientPhone,
} from "../redux/pizzaSlice.tsx";
import { Link } from "react-router-dom";

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

interface DeliveryMethodState {
  deliveryInfo: {
    deliveryMethod: string;
  };
}

interface PaymentRoot {
  pizza: PaymentMethodState;
}

interface PaymentMethodState {
  deliveryInfo: {
    paymentMethod: string;
  };
}

interface DeliveryInfo {
  deliveryInfo: {
    deliveryMethod: string;
    paymentMethod: string;
    totalPrice: number;
    phone: string;
    name: string;
    email: string;
    address: string;
    house: number;
    apartment: number;
  };
}

interface DeliveryInfoRoot {
  pizza: DeliveryInfo;
}

interface DeliveryMethodRootState {
  pizza: DeliveryMethodState;
}

const Checkout: React.FC = () => {
  const dispatch = useDispatch();

  const deliveryMethods = ["Самовывоз", "Доставка"];

  const paymentMethods = [
    "Оплата картой онлайн",
    "Картой курьеру",
    "Наличными",
  ];

  const [nameValue, setNameValue] = useState<string>("");

  const [isNameValid, setIsNameValid] = useState<boolean>(false);

  const [phoneValue, setPhoneValue] = useState<string>("");

  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const productCart = useSelector(
    (state: PizzaRootState) => state.pizza.productsCart,
  );

  const storeDeliveryMethod = useSelector(
    (state: DeliveryMethodRootState) => state.pizza.deliveryInfo.deliveryMethod,
  );

  const storePaymentMethod = useSelector(
    (state: PaymentRoot) => state.pizza.deliveryInfo.paymentMethod,
  );

  const storeDeliveryInfo = useSelector(
    (state: DeliveryInfoRoot) => state.pizza.deliveryInfo,
  );

  function validateName() {
    const isNameLengthValid = nameValue.length > 0;

    if (!isNameLengthValid) {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
      dispatch(setClientName(nameValue));
    }
  }

  function validatePhone() {
    const phoneValid = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phoneValue);

    const isPhoneLengthValid = phoneValue.length === 16;

    if (!phoneValid && isPhoneLengthValid) {
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
      dispatch(setClientPhone(phoneValue));
    }
  }

  function isActiveDeliveryMethod(deliveryMethod: string) {
    return deliveryMethod === storeDeliveryMethod;
  }

  function isActivePaymentMethod(paymentMethod: string) {
    return paymentMethod === storePaymentMethod;
  }

  function selectDelivery(index: number) {
    dispatch(updateDeliveryMethod(deliveryMethods[index]));
  }

  function selectPayment(index: number) {
    dispatch(updatePaymentMethod(paymentMethods[index]));
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();

    if (!phoneValue && !nameValue) {
      setIsNameValid(true);
      setIsPhoneValid(true);
    } else {
      console.log("отправка формы");

      const jsonProductCart = JSON.stringify(productCart);

      const jsonDeliveryInfo = JSON.stringify(storeDeliveryInfo);

      const file = new Blob([jsonProductCart, jsonDeliveryInfo], {
        type: "application/json",
      });
      const fileURL = URL.createObjectURL(file);
      window.location.href = fileURL;
    }
  }

  return (
    <>
      {productCart.length > 0 ? (
        <div className={styles.checkout}>
          <div className="container">
            <h1 className={styles.title}>Оформление заказа</h1>
            <div className="row">
              <div className="col-md-2">
                <div className="maskot">
                  <div className={styles.buble}>
                    <p>
                      Ещё чуть чуть и эта вкуснотища будет у тебя дома на столе!
                    </p>
                  </div>
                  <div className={styles.logo}>
                    <img src={cartImage} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-md-10">
                <div className={styles.cart}>
                  <div className={styles.delivery}>
                    <form onSubmit={submitForm} method="post" name="checkout">
                      <div className={styles.checkout__topFields}>
                        <p
                          className={classNames("form-row", styles.form)}
                          id="billing_phone_field"
                        >
                          <label htmlFor="billing_phone">
                            Телефон
                            <abbr
                              className={styles.required}
                              title="обязательно"
                            >
                              *
                            </abbr>
                          </label>
                          {isPhoneValid && (
                            <span className={styles.error_input}>
                              Введите корректный номер телефона! Пример:
                              +7(960)111-11-11
                            </span>
                          )}

                          <span className={styles.inputWrapper}>
                            <InputMask
                              className={styles.inputText}
                              type="tel"
                              name="billing_phone"
                              id="billing_phone"
                              mask="+7(***)***-**-**"
                              placeholder="+7(___)___-__-__"
                              defaultValue={phoneValue}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPhoneValue(e.target.value)
                              }
                              onBlur={validatePhone}
                            ></InputMask>
                          </span>
                        </p>
                        <p
                          className={classNames("form-row", styles.form)}
                          id="billing_first_name_field"
                        >
                          <label htmlFor="billing_first_name">
                            Имя
                            <abbr
                              className={styles.required}
                              title="обязательно"
                            >
                              *
                            </abbr>
                          </label>
                          {isNameValid && (
                            <span className={styles.error_input}>
                              Введите имя!
                            </span>
                          )}
                          <span className={styles.inputWrapper}>
                            <input
                              type="text"
                              name="billing_first_name"
                              id="billing_first_name"
                              onBlur={validateName}
                              defaultValue={nameValue}
                              onChange={(event) =>
                                setNameValue(event.target.value)
                              }
                              className={styles.inputText}
                            />
                          </span>
                        </p>
                      </div>
                      <p
                        className={classNames("form-row", styles.form)}
                        id="billing_email_field"
                      >
                        <label htmlFor="billing_email">Email</label>
                        <span className={styles.inputWrapper}>
                          <input
                            type="email"
                            name="billing_email"
                            id="email"
                            className={styles.inputText}
                          />
                        </span>
                      </p>
                      <div className={styles.type_delivery}>
                        <ul className={styles.delivery_items}>
                          {deliveryMethods.map((delivery, index) => (
                            <li
                              key={delivery}
                              onClick={() => selectDelivery(index)}
                              className={classNames(
                                styles.delivery_item,
                                isActiveDeliveryMethod(deliveryMethods[index])
                                  ? styles.active
                                  : "",
                              )}
                            >
                              {delivery}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {storeDeliveryMethod !== "Самовывоз" && (
                        <div>
                          <p
                            className={classNames("form-row", styles.form)}
                            id="billing_street_field"
                          >
                            <label htmlFor="billing_street">Улица</label>
                            <span className={styles.inputWrapper}>
                              <input
                                type="text"
                                name="billing_street"
                                id="street"
                                className={styles.inputText}
                              />
                            </span>
                          </p>
                          <div className="checkout__top-fields">
                            <p
                              className={classNames("form-row", styles.form)}
                              id="billing_home_field"
                            >
                              <label htmlFor="billing_home">Дом</label>
                              <span className={styles.inputWrapper}>
                                <input
                                  type="text"
                                  name="billing_home"
                                  id="home"
                                  className={styles.inputText}
                                />
                              </span>
                            </p>
                            <p
                              className={classNames("form-row", styles.form)}
                              id="billing_first_apartment_field"
                            >
                              <label htmlFor="billing_apartment">
                                Квартира
                              </label>
                              <span className={styles.inputWrapper}>
                                <input
                                  type="text"
                                  name="billing_apartment"
                                  id="apartment"
                                  className={styles.inputText}
                                />
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                      <div id={styles.order_review}>
                        <div id="payment">
                          <label>Способ оплаты</label>
                          <div className={styles.payment_methods_wrap}>
                            <ul className={styles.payment_methods}>
                              {paymentMethods.map((payment, index) => (
                                <li
                                  key={payment}
                                  onClick={() => selectPayment(index)}
                                  className={classNames(
                                    styles.delivery_item,
                                    isActivePaymentMethod(paymentMethods[index])
                                      ? styles.active
                                      : "",
                                  )}
                                >
                                  {payment}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className={styles.payment_total}>
                        <button
                          type="submit"
                          className={classNames(
                            styles.checkout_button,
                            !isNameValid && !isPhoneValid
                              ? styles.redBtn
                              : styles.greyBtn,
                          )}
                          disabled={isNameValid || isPhoneValid}
                          id="place_order"
                        >
                          Подтвердить заказ
                        </button>
                        <Link to="/pizza-react" className={styles.return}>
                          Вернуться в меню
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Link
            to="/pizza-react"
            className={classNames("m-auto", "mt-5", styles.return)}
          >
            Вернуться в меню
          </Link>
        </div>
      )}
    </>
  );
};

export default Checkout;
