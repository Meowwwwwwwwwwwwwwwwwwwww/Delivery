import React, { useState, useEffect, useCallback } from "react";
import { Moon, ShoppingBag, Trash2, Minus, Plus, Wallet, LogIn, Utensils, ClipboardList, UserPlus } from "lucide-react";

// --- 1. API CONFIGURATION AND UTILITIES ---

// IMPORTANT: === YOU MUST SET THIS VALUE ===
const BASE_URL_PLACEHOLDER = 'http://localhost:8000'; 
const BASE_URL = BASE_URL_PLACEHOLDER; 
// ===========================================

// Function to check if the BASE_URL has been configured
const isBaseUrlConfigured = () => BASE_URL !== 'https://YOUR-DJANGO-BACKEND-URL-HERE'; // Note: Checking against the original placeholder for initial setup error

// === CONFIGURATION UPDATED FOR SIMPLE JWT ===
const LOGIN_PATH = 'api/token/'; 
const REFRESH_PATH = 'api/token/refresh/';
const REGISTER_PATH = 'users/';
const AUTH_TYPE = 'Bearer'; 
// ==========================================

// Order status list for mock data (used temporarily due to missing serializer fields)
const MOCK_STATUSES = ['Preparing', 'Delivered', 'Cancelled'];

// Format INR currency
const formatINR = (n) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;


// --- JWT DECODE UTILITY (NEW) ---
/**
 * Decodes the base64-encoded JWT payload to extract user information.
 */
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT payload:", e);
        return null;
    }
};
// ---------------------------------

// --- FETCHING & AUTH UTILITIES ---

// Helper function for exponential backoff retry logic (basic)
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status} for ${url}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.detail || errorBody.message || errorBody.non_field_errors?.[0] || JSON.stringify(errorBody);
        } catch (e) {
            // response was not JSON, use default error message
        }
        // Throw an error that includes the status for 401 detection
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }
      return response;
    } catch (error) {
      // Only retry if status is NOT 401 (handled by apiFetch)
      if (error.status === 401) throw error; 
      
      if (i === retries - 1) throw error; 

      const delay = Math.pow(2, i) * 1000; 
      console.warn(`Request failed for ${url}. Retrying in ${delay / 1000}s... Attempt ${i + 1}/${retries}.`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Helper to get authorization headers
const getAuthHeaders = (token, contentType = 'application/json') => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `${AUTH_TYPE} ${token}`; 
  }
  return headers;
};

// --- TOKEN REFRESH LOGIC ---

let isRefreshing = false;
let refreshPromise = null;

const refreshToken = async () => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    const currentRefreshToken = localStorage.getItem("refresh_token");
    
    if (!currentRefreshToken) {
        isRefreshing = false;
        throw new Error("No refresh token available. Forced logout."); 
    }

    const refreshUrl = `${BASE_URL}/${REFRESH_PATH}`;
    const payload = { refresh: currentRefreshToken };

    refreshPromise = fetchWithRetry(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }, 1) 
    .then(async (response) => {
        const data = await response.json();
        const newAccessToken = data.access;
        if (!newAccessToken) {
            throw new Error("Refresh failed: New access token missing.");
        }
        localStorage.setItem("access_token", newAccessToken);
        // NOTE: We don't re-decode/store username here, as the user state in App is already set.
        return newAccessToken;
    })
    .catch(error => {
        console.error("Token refresh failed entirely. Logging out.", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("mm_username");
        throw new Error("Forced logout due to token refresh failure."); 
    })
    .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });

    return refreshPromise;
};

// --- AUTH-AWARE API FETCH WRAPPER ---
const apiFetch = async (url, options = {}) => {
    let token = localStorage.getItem("access_token");
    let response;

    try {
        response = await fetchWithRetry(url, {
            ...options,
            headers: getAuthHeaders(token, options.headers?.['Content-Type']),
        }, 1);
        return response;
    } catch (error) {
        if (error.status !== 401) {
            throw error; 
        }
    }

    try {
        const newAccessToken = await refreshToken();
        token = newAccessToken; 

        response = await fetchWithRetry(url, {
            ...options,
            headers: getAuthHeaders(token, options.headers?.['Content-Type']),
        }, 1);
        
        return response;
    } catch (error) {
        throw error;
    }
};

// --- API FUNCTIONS ---

// POST /register/ - User registration (UNPROTECTED)
const registerUser = async (userData) => {
  if (!isBaseUrlConfigured()) {
    throw new Error("Configuration Error: Please update the BASE_URL constant in App.jsx.");
  }
  const url = `${BASE_URL}/${REGISTER_PATH}`;
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json(); 
};

// GET /restaurants/ - Fetches menu data (UNPROTECTED)
const fetchRestaurants = async () => {
  if (!isBaseUrlConfigured()) {
    throw new Error("Configuration Error: Please update the BASE_URL constant in App.jsx.");
  }
  const url = `${BASE_URL}/restaurants/`; 
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: getAuthHeaders(null, null), 
  });
  const data = await response.json();
  
  const listData = Array.isArray(data) ? data : data.results || [];
  
  return listData.map((restaurant) => ({
    category: restaurant.name,
    items: (Array.isArray(restaurant.menu_items) ? restaurant.menu_items : [])
      .filter(it => it.is_available) 
      .map((it) => ({
        id: it.id,
        name: it.name,
        desc: it.description || 'No description provided.',
        price: parseFloat(it.price),
        img: `https://placehold.co/300x128/1F2937/fff?text=${it.name.split(' ')[0]}`,
        tag: restaurant.name || 'Food', 
      })),
  }));
};

// GET /orders/ - Fetches user's orders (PROTECTED - uses apiFetch)
const fetchOrders = async () => {
  if (!isBaseUrlConfigured()) {
    throw new Error("Configuration Error: Please update the BASE_URL constant in App.jsx.");
  }
  const url = `${BASE_URL}/orders/`; 
  const response = await apiFetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  
  const orderList = Array.isArray(data) ? data : data.results || [];

  const mockOrders = orderList.map(order => ({
    ...order,
    // Note: The total calculation is mocked here because the exact Django serializer fields are unknown.
    total: order.items?.reduce((sum, item) => sum + (item.quantity * item.menu_item_price), 0) || order.total || Math.floor(Math.random() * 500) + 100,
    status: order.status || MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)],
    date: order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
  }));
  
  return mockOrders; 
};

/**
 * POST /orders/ - Places a new order (PROTECTED - uses apiFetch)
 */
const placeOrder = async (cart) => {
  if (!isBaseUrlConfigured()) {
    throw new Error("Configuration Error: Please update the BASE_URL constant in App.jsx.");
  }
  
  const url = `${BASE_URL}/orders/`; 
  
  const orderItemsPayload = cart.map(item => ({
      menu_item: item.id, 
      quantity: item.qty,
  }));
  
  const payload = {
      items: orderItemsPayload
  };
  
  console.log("Sending order payload to /orders/ for saving in PostgreSQL:", payload);
  
  const response = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  return await response.json(); 
};

const placeOrderViaWhatsApp = (cart) => {
  const message = cart
    .map((x) => `${x.name} x ${x.qty} = ${formatINR(x.price * x.qty)}`)
    .join("\n");
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const total = subtotal + 40; 

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `*Midnight Munch Order Summary*\n\n${message}\n\nDelivery Charge: ${formatINR(40)}\n*Total: ${formatINR(total)}*\n\n(Order sent via Midnight Munch App)`
  )}`;
  window.open(whatsappUrl, "_blank");
};


// --- 2. REGISTER COMPONENT (NEW) ---

const Register = ({ onRegistrationSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ username, email, password });
      onRegistrationSuccess(`Registration successful for ${username}! Please log in now.`); 
    } catch (err) {
      console.error("Registration failed:", err);
      setError(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-2xl border border-violet-700/50">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-green-400">
          <UserPlus className="w-6 h-6"/> Sign Up
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
              placeholder="Secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-green-600/30 disabled:bg-green-800"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Already have an account? 
          <button 
            onClick={onSwitchToLogin}
            className="text-violet-400 hover:text-violet-300 font-semibold ml-1"
          >
            Log In here
          </button>
        </div>
      </div>
    </div>
  );
};


// --- 3. LOGIN COMPONENT (Updated with username storage and debug log) ---

const Login = ({ onLoginSuccess, onSwitchToRegister, setUsername }) => { 
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isBaseUrlConfigured()) {
        throw new Error("Configuration Error: Please update the BASE_URL constant in App.jsx.");
      }
      
      const url = `${BASE_URL}/${LOGIN_PATH}`; 
      
      const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password }), 
      });
      
      const data = await response.json();

      const accessToken = data.access;
      const refreshToken = data.refresh; 
      
      if (!accessToken || !refreshToken) {
        throw new Error("Login successful, but access or refresh token not received. Check your Django configuration.");
      }
      
      // DECODE TOKEN AND GET USERNAME
      const payload = decodeJwt(accessToken);
      
      // DEBUGGING: Log the payload so the user can verify the field name
      console.log("JWT Payload Decoded:", payload);
      
      // === FIX APPLIED HERE ===
      // 1. Try to get username from the token payload (if Django configured it)
      // 2. FALLBACK: Use the username the user just typed in (usernameInput - the fix!)
      // 3. Last resort: Use the user_id (the number 7)
      const user = payload?.username || usernameInput || payload?.user_id; 
      // ========================

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken); 
      localStorage.setItem("mm_username", user); // Store actual username locally
      
      setUsername(user); // Update state in App
      onLoginSuccess(); 
      
    } catch (err) {
      console.error("Login failed:", err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-2xl border border-violet-700/50">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-violet-400">
          <LogIn className="w-6 h-6"/> Login to Munch
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Your Django username/email"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required // Added required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Your Django password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Added required
            />
          </div>
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-violet-600/30 disabled:bg-violet-800"
          >
            {loading ? 'Logging In...' : 'Login & Start Ordering'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Don't have an account? 
          <button 
            onClick={onSwitchToRegister}
            className="text-green-400 hover:text-green-300 font-semibold ml-1"
          >
            Sign Up here
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Modal for Alerts/Messages (replaces `alert()`)
const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-2xl border border-violet-600">
        <h3 className="text-xl font-bold mb-4 text-violet-400">Notification</h3>
        <p className="text-gray-200" dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }} />
        <button
          onClick={onClose}
          className="mt-6 w-full bg-violet-600 hover:bg-violet-700 py-2 rounded-lg font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
);


// --- 4. MAIN ORDER INTERFACE (Refactored View) ---

const MainOrderInterface = ({ menu, setMenu, cart, setCart, orders, setOrders, loading, setLoading, orderLoading, setOrderLoading, setErrorModal, isLoggedIn, loadOrders, handleLogout }) => {
    
    // Cart helpers (remain unchanged)
    const addToCart = (item) => {
        setCart((prev) => {
          const existing = prev.find((x) => x.id === item.id);
          if (existing) return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
          return [...prev, { 
            ...item, 
            qty: 1, 
            tag: item.tag, 
            price: item.price, 
            name: item.name, 
            desc: item.desc,
            img: item.img
          }];
        });
    };

    const inc = (id) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
    const dec = (id) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x)).filter(x => x.qty > 0));
    const del = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

    // Cart totals calculation
    const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
    const deliveryCharge = cart.length > 0 ? 40 : 0;
    const total = subtotal + deliveryCharge;

    // Place order handler - UPDATED SUCCESS MESSAGE HERE
    const handlePlaceOrder = async () => {
        if (!cart.length) {
          setErrorModal("Your cart is empty! Add some delicious food first.");
          return;
        }

        setOrderLoading(true); 
        try {
          // 1. THIS IS WHERE THE ORDER IS SAVED TO POSTGRESQL VIA DJANGO API
          const data = await placeOrder(cart); 
          
          // 2. Open WhatsApp for confirmation/payment
          placeOrderViaWhatsApp(cart); 
          setCart([]); 
          
          // 3. UPDATED: Explicitly state the order is saved (Order ID from Django response)
          setErrorModal(`*Order Saved!* Order ID: ${data.id}. Your order has been recorded in our system. A WhatsApp chat has opened for final payment/confirmation.`);
          loadOrders(); 
        } catch (err) {
          const errorMessage = err.message || "Order failed. Check the console for details.";
          console.error("Place order failed:", err);
          setErrorModal(errorMessage);
        } finally {
          setOrderLoading(false);
        }
    };
    
    return (
        <main className="flex-1 lg:flex lg:flex-row-reverse">
            
            {/* RIGHT SIDE: CART & ORDERS (Sticky on Desktop) */}
            <div className="lg:w-1/3 p-4 border-l border-gray-800 lg:sticky lg:top-[77px] lg:h-[calc(100vh-77px)] lg:overflow-y-auto bg-gray-800/50">
            
            <section className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-green-400"><ShoppingBag className="w-5 h-5" /> Your Cart ({cart.length})</h2>
                
                {cart.length === 0 ? (
                <p className="opacity-70 text-center py-4 italic">Your midnight munch list is empty!</p>
                ) : (
                <>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cart.map((x) => (
                        <div key={x.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div className="flex-1 mr-4">
                            <p className="font-medium text-base">{x.name}</p>
                            <p className="text-sm opacity-70">{formatINR(x.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => dec(x.id)} className="bg-gray-600 p-1 rounded-full hover:bg-gray-500 transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-5 text-center font-bold text-violet-300">{x.qty}</span>
                            <button onClick={() => inc(x.id)} className="bg-gray-600 p-1 rounded-full hover:bg-gray-500 transition-colors"><Plus className="w-4 h-4" /></button>
                            <button onClick={() => del(x.id)} className="bg-red-600 p-1 rounded-full hover:bg-red-700 ml-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        </div>
                    ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-700 rounded-lg space-y-2 border-t border-gray-600">
                    <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{formatINR(subtotal)}</span></div>
                    <div className="flex justify-between text-sm"><span>Delivery Charge:</span><span>{formatINR(deliveryCharge)}</span></div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-600 text-violet-300">
                        <span>Total:</span><span>{formatINR(total)}</span>
                    </div>
                    
                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={orderLoading || !isLoggedIn} 
                        className="w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-xl mt-4 font-semibold text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:bg-violet-800 disabled:cursor-wait"
                    >
                        {orderLoading ? "Placing Order..." : <><Wallet className="w-5 h-5" /> Save Order & Chat</>}
                    </button>
                    {!isLoggedIn && <p className="text-xs text-red-400 text-center mt-2">Log in to place your order!</p>}
                    </div>
                </>
                )}
            </section>

            {/* ORDERS SECTION */}
            <section className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-yellow-400"><ClipboardList className="w-5 h-5" /> My Recent Orders</h2>
                {isLoggedIn ? (
                    <>
                        <button 
                            onClick={loadOrders} 
                            disabled={orderLoading} 
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition-colors mb-4 w-full disabled:bg-purple-800 disabled:cursor-wait"
                        >
                            {orderLoading ? 'Loading...' : `Fetch Orders (${orders.length})`}
                        </button>
                        
                        <div className="space-y-3">
                            {orders.length === 0 ? ( 
                            <p className="text-sm opacity-70 italic">No orders loaded yet.</p>
                            ) : (
                            orders.slice(0, 3).map((order) => (
                                <div key={order.id} className="p-3 bg-gray-700 rounded-lg text-sm">
                                <div className="flex justify-between font-semibold">
                                    <span>ID: {order.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-600' : 
                                    order.status === 'Preparing' ? 'bg-yellow-600' : 
                                    'bg-red-600'
                                    }`}>{order.status}</span>
                                </div>
                                <p className="text-xs opacity-70 mt-1">Total: {formatINR(order.total)} | Date: {order.date}</p>
                                </div>
                            ))
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-sm opacity-70 italic text-center py-4">Log in to view your order history.</p>
                )}
            </section>

            </div>
            
            {/* LEFT SIDE: MENU */}
            <div className="lg:w-2/3 p-4">
                <section className="pb-10">
                    <h2 className="text-3xl font-bold flex items-center gap-2 mb-6 text-violet-300">
                        <Utensils className="w-6 h-6"/> Midnight Menu
                    </h2>
                    {loading && <p className="mt-4 text-gray-400 text-center animate-pulse">Fetching deliciousness...</p>}
                    {!loading && menu.length === 0 && (
                        <div className="mt-6 text-center opacity-70">
                            <p>No restaurants or menu items available.</p>
                            <button onClick={() => window.location.reload()} className="mt-4 bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">Reload</button>
                        </div>
                    )}
                    {menu.map((block) => (
                        <div key={block.category} className="mt-8">
                            <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 text-gray-300">{block.category}</h3>
                            {block.items.length === 0 ? (
                                <div className="text-sm opacity-60 italic mt-2">No menu items available for this restaurant.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {block.items.map((it) => (
                                        <div 
                                            key={it.id} 
                                            className="bg-gray-800 rounded-xl p-4 flex flex-col shadow-xl hover:shadow-violet-500/10 transition-shadow duration-300 transform hover:scale-[1.01]"
                                        >
                                            <img 
                                                src={it.img} 
                                                alt={it.name} 
                                                className="h-36 w-full object-cover rounded-lg mb-3 border border-gray-700" 
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-lg text-violet-200">{it.name}</p>
                                                <p className="text-sm opacity-70 text-gray-400 mt-1 h-10 overflow-hidden">{it.desc}</p>
                                                <p className="mt-2 text-xs font-medium text-gray-500 bg-gray-700 inline-block px-2 py-0.5 rounded-full">{it.tag}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="font-extrabold text-xl text-green-400">{formatINR(it.price)}</p>
                                                <button 
                                                    onClick={() => addToCart(it)} 
                                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-green-600/30 active:scale-95"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
};


// --- 5. MAIN APP COMPONENT (Updated State and Nav) ---

const useLocalList = (key) => {
  const [list, setList] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
  }, [list, key]);
  return [list, setList];
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("access_token") && !!localStorage.getItem("refresh_token")
  );
  // State for storing the username, initialized from localStorage
  const [username, setUsername] = useState(() => localStorage.getItem("mm_username") || null); 
  
  const [authView, setAuthView] = useState('login'); 
  
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useLocalList("mm_cart");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // Used for menu loading
  const [orderLoading, setOrderLoading] = useState(false); // Dedicated state for order fetching/placing
  const [errorModal, setErrorModal] = useState(
    !isBaseUrlConfigured() ? "🚨 **Configuration Required:** Please update the `BASE_URL` constant in the file to your actual Django backend URL to enable login and API calls." : null
  );

  // Fetch menu on load (Menu is public)
  useEffect(() => {
    if (!isBaseUrlConfigured()) return;

    setLoading(true);
    fetchRestaurants()
      .then((data) => setMenu(data))
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setErrorModal(`Failed to load menu: ${err.message}.`);
      })
      .finally(() => setLoading(false));
  }, []);

  // Load orders (memoized with useCallback)
  const loadOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    setOrderLoading(true); 
    try {
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? data : []); 
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.message.includes("Forced logout")) {
        // Handle forced logout from refreshToken failure
        setIsLoggedIn(false);
        setOrders([]);
        setUsername(null); // Clear username on forced logout
        localStorage.removeItem("mm_username");
        setErrorModal("Session expired or token refresh failed. Please log in again.");
        return;
      }
      setErrorModal(`Failed to load orders: ${err.message}`);
    } finally {
      setOrderLoading(false); 
    }
  }, [isLoggedIn]);
  
  // Load orders on successful login or initial load if tokens exist
  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      setAuthView('login'); // Ensure the view is reset to 'login'
    }
  }, [isLoggedIn, loadOrders]);


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token"); 
    localStorage.removeItem("mm_username"); // Clear username
    setCart([]);
    setOrders([]);
    setIsLoggedIn(false);
    setUsername(null); // Clear username state
    setErrorModal("You have been successfully logged out.");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      
      {errorModal && <Modal message={errorModal} onClose={() => setErrorModal(null)} />}

      <nav className="p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-800 sticky top-0 z-20 shadow-xl border-b border-gray-700">
        <h1 className="font-extrabold text-3xl flex items-center gap-2 text-violet-400">
          <Moon className="w-6 h-6 fill-violet-400" /> Midnight Munch
        </h1>
        {isLoggedIn ? (
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
                {/* Check the username state and fall back to 'Guest' if null */}
                <span className="text-sm font-medium text-gray-300 bg-gray-700 px-3 py-1 rounded-full border border-violet-500/50">
                    Welcome, <strong className="text-violet-400">{username || 'Guest'}</strong>!
                </span>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                    Logout
                </button>
            </div>
        ) : (
            <div className="mt-3 sm:mt-0">
                <button 
                    onClick={() => {
                        setAuthView('login');
                        setErrorModal("Please log in to start ordering.");
                    }}
                    className="text-sm text-violet-400 hover:text-violet-300 font-semibold"
                >
                    Log In
                </button>
            </div>
        )}
      </nav>

      {/* Main Content Render */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center pt-8 flex-1">
          {/* Show Login component */}
          {authView === 'login' && (
            <Login 
              onLoginSuccess={() => setIsLoggedIn(true)} 
              onSwitchToRegister={() => setAuthView('register')} 
              setUsername={setUsername} // Pass the setter
            />
          )}
          {/* Show Register component */}
          {authView === 'register' && (
            <Register 
              onRegistrationSuccess={(message) => { // Sets success message and switches to login
                setErrorModal(message);
                setAuthView('login');
              }} 
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>
      ) : (
        <MainOrderInterface 
            menu={menu}
            setMenu={setMenu}
            cart={cart}
            setCart={setCart}
            orders={orders}
            setOrders={setOrders}
            loading={loading}
            setLoading={setLoading}
            orderLoading={orderLoading}
            setOrderLoading={setOrderLoading}
            setErrorModal={setErrorModal}
            isLoggedIn={isLoggedIn}
            loadOrders={loadOrders}
            handleLogout={handleLogout}
        />
      )}
    </div>
  );
}
