// src/App.jsx
import React, { useEffect, useState } from "react";
import { Moon, ShoppingBag, Trash2, Minus, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { fetchOrders, placeOrder, fetchRestaurants } from "./api";

// Helper to format currency
function formatINR(n) {
  return `₹${n}`;
}

// Custom hook for localStorage persistence
function useLocalList(key) {
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(list));
  }, [list, key]);
  return [list, setList];
}

export default function App() {
  const navigate = useNavigate();

  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // --- Data State ---
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useLocalList("mm_cart");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch Restaurants/Menu ---
  useEffect(() => {
    setLoading(true);
    fetchRestaurants()
      .then((res) => {
        const restaurants = Array.isArray(res) ? res : res.results || [];
        const formatted = restaurants.map((restaurant) => ({
          category: restaurant.name,
          items: restaurant.menu_items.map((it) => ({
            id: it.id,
            name: it.name,
            desc: it.description,
            price: parseFloat(it.price),
            img: "https://picsum.photos/300",
            tag: restaurant.name,
          })),
        }));
        setMenu(formatted);
      })
      .catch((err) => console.error("Error fetching menu:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Orders ---
  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const data = await placeOrder(
        cart.map((x) => ({ menu_item: x.id, quantity: x.qty }))
      );
      alert(`Order placed successfully! Order ID: ${data.id}`);
      setCart([]); // clear cart
    } catch (err) {
      alert("Order failed. Please login first.");
      console.error(err);
    }
  };

  // --- Cart Helpers ---
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const inc = (id) =>
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  const del = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

  // --- Totals ---
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const deliveryCharge = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryCharge;

  // --- UI ---
  return (
    <div className="bg-gray-900 text-white min-h-[100vh] overflow-y-auto flex flex-col">
      {/* Navbar */}
      <nav className="p-4 flex justify-between items-center bg-gray-800 sticky top-0 z-10 shadow-md">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Moon className="w-5 h-5" /> Midnight Munch
        </h1>
      </nav>

      <main className="flex-1 pb-20">
        {!isLoggedIn ? (
          <Login onAuthChange={setIsLoggedIn} />
        ) : (
          <>
            {/* Menu Section */}
            <section className="p-6 pb-10">
              <h2 className="text-2xl font-semibold">🍔 Menu</h2>
              {loading && <p className="mt-4 text-gray-400">Loading menu...</p>}

              {!loading && menu.length === 0 && (
                <div className="mt-6 text-center opacity-70">
                  <p>No restaurants or menu items available.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-700"
                  >
                    Reload
                  </button>
                </div>
              )}

              {menu.map((block) => (
                <div key={block.category} className="mt-8">
                  <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
                    {block.category}
                  </h3>

                  {block.items.length === 0 ? (
                    <div className="text-sm opacity-60 italic mt-2">
                      No menu items available for this restaurant.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                      {block.items.map((it) => (
                        <div
                          key={it.id}
                          className="bg-gray-800 rounded-xl p-3 flex flex-col hover:scale-[1.02] transition-transform"
                        >
                          <img
                            src={it.img}
                            alt={it.name}
                            className="h-32 w-full object-cover rounded-md"
                          />
                          <div className="mt-2 flex-1">
                            <p className="font-medium text-lg">{it.name}</p>
                            <p className="text-sm opacity-70">{it.desc}</p>
                          </div>
                          <p className="mt-2 font-semibold">
                            {formatINR(it.price)}
                          </p>
                          <button
                            onClick={() => addToCart(it)}
                            className="mt-3 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Cart Section */}
            <section className="p-6 border-t border-gray-700 bg-gray-850 max-h-[400px] overflow-y-auto">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart
              </h2>

              {cart.length === 0 ? (
                <p className="opacity-70 mt-2">Cart is empty</p>
              ) : (
                <>
                  {cart.map((x) => (
                    <div
                      key={x.id}
                      className="flex items-center justify-between mt-3 bg-gray-800 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{x.name}</p>
                        <p className="text-sm opacity-70">
                          {formatINR(x.price)} × {x.qty}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dec(x.id)}
                          className="bg-gray-700 px-2 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{x.qty}</span>
                        <button
                          onClick={() => inc(x.id)}
                          className="bg-gray-700 px-2 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => del(x.id)}
                          className="bg-red-600 px-2 rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 space-y-1">
                    <p>Subtotal: {formatINR(subtotal)}</p>
                    <p>Delivery: {formatINR(deliveryCharge)}</p>
                    <p className="font-bold text-lg">
                      Total: {formatINR(total)}
                    </p>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-violet-600 hover:bg-violet-700 py-2 rounded-lg mt-2 font-semibold"
                    >
                      <Wallet className="w-4 h-4 inline mr-2" /> Place Order
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* Orders Section */}
            <section className="p-6 border-t border-gray-700 bg-gray-850">
              <h2 className="text-xl font-semibold mb-2">📦 My Orders</h2>
              <button
                onClick={loadOrders}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
              >
                Fetch My Orders
              </button>
              {orders.length > 0 && (
                <pre className="mt-4 bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(orders, null, 2)}
                </pre>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
