import React, { createContext, useContext, useState } from "react";

const initialMenu = [
  {
    category: "Signatures",
    items: [
      {
        id: "love-locks-burger",
        name: "Love‑Locks Burger",
        price: 169,
        tag: "❤ Signature",
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
        desc: "Heart‑shaped patty, sweet dip.",
      },
      // ...add more signature items...
    ],
  },
  {
    category: "Snacks",
    items: [
      {
        id: "cheesy-pizza-slices",
        name: "Cheesy Pizza Slices",
        price: 149,
        tag: "🍕",
        img: "https://images.unsplash.com/photo-1548365328-9f547fb09566?q=80&w=1200&auto=format&fit=crop",
        desc: "Mozzarella overload.",
      },
      // ...add more snack items...
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        id: "cold-coffee",
        name: "Cold Coffee",
        price: 109,
        tag: "🥤",
        img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop",
        desc: "Thick, café‑style.",
      },
      // ...add more drink items...
    ],
  },
];

const MenuContext = createContext();

export function useMenu() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(initialMenu);

  // Add a new item to a category (if category exists)
  const addMenuItem = (category, item) => {
    setMenu((prevMenu) =>
      prevMenu.map((block) =>
        block.category === category
          ? { ...block, items: [...block.items, item] }
          : block
      )
    );
  };

  return (
    <MenuContext.Provider value={{ menu, addMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
}