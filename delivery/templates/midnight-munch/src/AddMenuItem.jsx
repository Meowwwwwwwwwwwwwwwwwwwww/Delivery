import React from "react";
import { useMenu } from "./MenuContext";
import { useNavigate } from "react-router-dom";

const predefinedItems = [
  {
    category: "Signatures",
    items: [
      { id: "new-midnight-burger", name: "Midnight Burger", price: 180, tag: "🌙 New", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1200&auto=format&fit=crop", desc: "Special midnight treat." },
      // ...add more items/categories as you wish...
      { id: "love-locks-burger", name: "Love‑Locks Burger", price: 169, tag: "❤ Signature", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop", desc: "Heart‑shaped patty, sweet dip." },
      { id: "breakup-biryani", name: "Breakup Biryani", price: 199, tag: "💔 Spicy", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", desc: "Extra spice + mini ice‑cream cup." },
      { id: "gaming-combo", name: "Gaming Night Combo", price: 239, tag: "🎮 Combo", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop", desc: "Finger foods + energy drink." },
      { id: "horror-pack", name: "Horror & Munch Pack", price: 219, tag: "🎥 Movie", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", desc: "Movie‑night snacks + QR playlist." },
    ],
  },
  {
    category: "Snacks",
    items: [
      { id: "cheesy-pizza-slices", name: "Cheesy Pizza Slices", price: 149, tag: "🍕", img: "https://images.unsplash.com/photo-1548365328-9f547fb09566?q=80&w=1200&auto=format&fit=crop", desc: "Mozzarella overload." },
      { id: "peri-peri-fries", name: "Peri‑Peri Fries", price: 89, tag: "🔥", img: "https://images.unsplash.com/photo-1550547660-20e0b3c1ee47?q=80&w=1200&auto=format&fit=crop", desc: "Crispy + spicy dust." },
      { id: "veg-sandwich", name: "Veg Sandwich", price: 99, tag: "🥪", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop", desc: "Toasted, mint chutney." },
    ],
  },
  {
    category: "Desserts",
    items: [
      { id: "choco-lava", name: "Chocolate Lava Cake", price: 119, tag: "🍫", img: "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop", desc: "Warm gooey core." },
      { id: "ice-cream-cup", name: "Ice‑Cream Cup", price: 69, tag: "🍨", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop", desc: "Vanilla/Chocolate." },
    ],
  },
  {
    category: "Drinks",
    items: [
      { id: "cold-coffee", name: "Cold Coffee", price: 109, tag: "🥤", img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop", desc: "Thick, café‑style." },
      { id: "energy-drink", name: "Energy Drink", price: 129, tag: "⚡", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1200&auto=format&fit=crop", desc: "Night‑owl fuel." },
      { id: "hot-cocoa", name: "Hot Cocoa", price: 89, tag: "☕", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop", desc: "Comfort in a cup." },
    ],
  },
];

    


export default function AddMenuItem() {
  const { addMenuItem } = useMenu();
  const navigate = useNavigate();

  const handleAdd = (category, item) => {
    addMenuItem(category, item);
    navigate("/"); // Redirect to main page after adding
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Add Menu Item</h2>
      {predefinedItems.map((block) => (
        <div key={block.category} className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">{block.category}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {block.items.map((it) => (
              <div
                key={it.id}
                className="rounded-3xl border border-gray-700 bg-gray-900 overflow-hidden flex flex-col cursor-pointer hover:border-violet-500 transition"
                onClick={() => handleAdd(block.category, it)}
              >
                <img src={it.img} alt={it.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="text-base flex items-center justify-between text-white">
                    <span>{it.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700">{it.tag}</span>
                  </div>
                  <div className="text-sm opacity-80 text-gray-300">{it.desc}</div>
                  <div className="font-semibold mt-2 text-white">₹{it.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}