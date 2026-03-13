import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { getUserIdFromToken } from "../utils/jwt";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [name, setname] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFoodList(response.data.data);
  };

  useEffect(() => {
    if (token) {
      async function loadData() {
        await fetchFoodList();

        await loadCartData();
      }
      loadData();
    }
  }, [token]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const userId = getUserIdFromToken(token);
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const loadCartData = async () => {
    if (token) {
      const response = await axios.get(
        `${url}/api/cart/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCartItems(response.data.cartData);
    }
  };

  const getTotalItemsCount = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    getTotalItemsCount,
    url,
    token,
    setToken,
    promoCode,
    setPromoCode,
    discount,
    setDiscount,
    discountApplied,
    setDiscountApplied,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
