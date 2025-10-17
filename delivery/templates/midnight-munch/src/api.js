// src/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";


// Fetch all orders
export const getOrders = async () => {
  const res = await axios.get(`${BASE_URL}/orders/`);
  return res.data;
};

// Existing functions
export const fetchRestaurants = async () => {
  const res = await axios.get(`${BASE_URL}/restaurants/`);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await axios.get(`${BASE_URL}/orders/`, {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
  });
  return res.data;
};


// New functions

export async function logoutUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(`${BASE_URL}/auth/token/logout/`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  localStorage.removeItem("token");
}

// src/api.j

export async function registerUser(username, password, email) {
  const res = await fetch(`${BASE_URL}/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return await res.json();
}



export async function loginUser(username, password) {
  const res = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json(); // will contain access and refresh tokens
}

export async function placeOrder(orderData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Order failed");
  return await res.json();
}

export async function getMenu() {
  const res = await fetch(`${BASE_URL}/menu/`);
  if (!res.ok) throw new Error("Failed to load menu");
  return await res.json();
}