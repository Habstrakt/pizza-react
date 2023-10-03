import { createSlice } from "@reduxjs/toolkit";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  selectedSize: number[];
  selectedPrice: number[] | null[];
  quantity: number;
}

const loadInitialState = () => {
  const localStorageData = localStorage.getItem("cart");

  if (localStorageData) {
    return JSON.parse(localStorageData);
  }

  return [];
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState: {
    productsCart: loadInitialState(),
    deliveryInfo: {
      deliveryMethod: "Самовывоз",
      paymentMethod: "Оплата картой онлайн",
      totalPrice: 0,
      phone: null,
      name: null,
      email: null,
      address: null,
      house: null,
      apartment: null,
    },
  },
  reducers: {
    setProductsLS: (state, action) => {
      state.productsCart = action.payload;
    },

    addProductToCart: (state, action) => {
      const newProduct = action.payload;

      const existingProduct = state.productsCart.find(
        (product: { id: number; selectedSize: number }) =>
          product.id === newProduct.id &&
          product.selectedSize === newProduct.selectedSize,
      );

      if (existingProduct) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        state.productsCart.push({ ...newProduct, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.productsCart));
    },

    incrementQuantity: (state, action) => {
      const productId = action.payload;

      const product = state.productsCart.find(
        (product: { id: number }) => product.id === productId,
      );

      if (product) {
        product.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.productsCart));
      }
    },

    decrementQuantity: (state, action) => {
      const productId = action.payload;

      const product = state.productsCart.find(
        (product: { id: number }) => product.id === productId,
      );

      if (product) {
        product.quantity -= 1;

        if (product.quantity === 0) {
          const productIndex = state.productsCart.findIndex(
            (product: { id: number }) => product.id === productId,
          );
          state.productsCart.splice(productIndex, 1);
        }
      }

      localStorage.setItem("cart", JSON.stringify(state.productsCart));
    },

    calculatedTotalPrice: (state) => {
      state.deliveryInfo.totalPrice = state.productsCart.reduce(
        (price: number, product: Product) =>
          price +
          (product.selectedPrice as unknown as number) * product.quantity,
        0,
      );
    },

    updateDeliveryMethod: (state, action) => {
      state.deliveryInfo.deliveryMethod = action.payload;
    },

    updatePaymentMethod: (state, action) => {
      state.deliveryInfo.paymentMethod = action.payload;
    },

    setClientName: (state, action) => {
      state.deliveryInfo.name = action.payload;
    },

    setClientPhone: (state, action) => {
      state.deliveryInfo.phone = action.payload;
    },
  },
});

export const {
  setProductsLS,
  addProductToCart,
  incrementQuantity,
  decrementQuantity,
  calculatedTotalPrice,
  updateDeliveryMethod,
  updatePaymentMethod,
  setClientName,
  setClientPhone,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;
