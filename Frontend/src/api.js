import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Django backend URL
});

// JWT interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// --- API Functions ---
export const fetchRestaurants = async () => {
  const res = await api.get("/restaurants/");
  return res.data;
};

export const fetchOrders = async () => {
  const res = await api.get("/orders/");
  return res.data;
};

export const placeOrder = async (cart) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token. Please login.");

  // Prepare payload
  const payload = { items: cart.map(x => ({ menu_item: x.id, quantity: x.qty })) };

  try {
    // First attempt
    return await axios.post(`${BASE_URL}/orders/`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    // If token expired, refresh and retry
    if (err.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        return await axios.post(`${BASE_URL}/orders/`, payload, {
          headers: { 
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json"
          }
        });
      }
    }
    // If still fails, throw the error
    throw err;
  }
};


export const placeOrderViaWhatsApp = (cart) => {
  const message = cart
    .map((x) => `${x.name} x ${x.qty} = ₹${x.price * x.qty}`)
    .join("\n");
  const total = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Order Summary:\n${message}\nTotal: ₹${total}`
  )}`;
  window.open(whatsappUrl, "_blank");
};
