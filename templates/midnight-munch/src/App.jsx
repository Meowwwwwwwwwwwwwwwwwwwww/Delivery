import React, { useEffect, useMemo, useState } from "react";
import { Moon, Clock, Sparkles, ShoppingBag, Phone, Lock, BadgePercent, Instagram, Send, Trash2, Minus, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "./MenuContext";
// ...

// ...use menu.map(...) instead of MENU.map(...)
// REMOVE this block:


const CONFIG = {
  brand: {
    name: "Midnight Munch",
    tagline: "Jab duniya soti hai, hum serve karte hain.",
    phone: "+91-7302084789",
    whatsapp: "+91-7302084789",
    insta: "https://www.instagram.com/midnightmunch24_7/",
    cityTag: "Bhimtal & nearby",
  },
  theme: {
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
  offers: {
    flashSaleCode: "MOON5",
    flashSaleWindowMinutes: 5,
    flashSaleDay: "Saturday",
    mysterySnackPrice: 1,
  },
  sections: {
    hero: true,
    features: true,
    signatures: true,
    snacks: true,
    flashSale: true,
    moodMenu: true,
    confessionWall: true,
    membership: true,
    faq: true,
    footer: true,
  },
};

/*const MENU = [
  {
    category: "Signatures",
    items: [
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
];*/

// Custom Components (simplified versions)
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => <div className="p-4 pb-2">{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`font-semibold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <p className={`text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = "" }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = "" }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;

const Button = ({ children, className = "", size = "md", variant = "default", disabled = false, onClick, asChild = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };
  const variantClasses = {
    default: "bg-violet-600 hover:bg-violet-700 text-white",
    outline: "border border-gray-600 hover:bg-gray-700 text-white"
  };
  
  if (asChild && React.Children.count(children) === 1) {
    return React.cloneElement(React.Children.only(children), {
      className: `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`,
      ...props
    });
  }
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${className}`}
    {...props} 
  />
);

const Switch = ({ checked, onCheckedChange, id }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
  </label>
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>{children}</label>
);

// Utility Hooks
function useMidnightCountdown() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = new Date();
      t.setHours(24, 0, 0, 0);
      const diff = Math.max(0, Math.floor((t.getTime() - now.getTime()) / 1000));
      setSeconds(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { hh, mm, ss, total: seconds };
}

function useLocalList(key) {
  const [list, setList] = useState([]);
  useEffect(() => {
    // Using in-memory storage only since localStorage isn't available in Claude artifacts
    setList([]);
  }, [key]);
  return [list, setList];
}

function NeonBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md border border-white/10">
      <Sparkles className="w-3 h-3" /> {children}
    </span>
  );
}

function formatINR(n) { 
  return `₹${n}`; 
}

export default function MidnightMunchApp() {
  const navigate = useNavigate();
  const { menu } = useMenu();
  // All state and hooks inside the component
  const [cart, setCart] = useLocalList("mm_cart");
  const [mystery, setMystery] = useState(false);
  const [confession, setConfession] = useState("");
  const [confessions, setConfessions] = useLocalList("mm_confessions");
  const [dark, setDark] = useState(true);

  // Cart helpers
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const inc = (id) =>
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));

  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );

  const del = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setCart([]);

  // Totals
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const mysteryCost = mystery && cart.length > 0 ? CONFIG.offers.mysterySnackPrice : 0;
  const total = subtotal + mysteryCost;

  // Order text + WhatsApp link
  const orderText = useMemo(() => {
    const lines = [];
    lines.push("Hi Midnight Munch 🌙");
    lines.push("I want to order:");
    cart.forEach((x) => lines.push(`• ${x.name} x${x.qty} = ₹${x.price * x.qty}`));
    if (mystery && cart.length > 0) lines.push(`• Mystery Snack = ₹${CONFIG.offers.mysterySnackPrice}`);
    lines.push(`Subtotal: ₹${subtotal}`);
    if (mysteryCost) lines.push(`+ Mystery: ₹${mysteryCost}`);
    lines.push(`Total: ₹${total}`);
    lines.push("Delivery location: (share your location pin)");
    return lines.join("\n");
  }, [cart, mystery, subtotal, total, mysteryCost]);

  const enc = (s) => encodeURIComponent(s);
  const waNumber = CONFIG.brand.whatsapp.replace(/[^\d+]/g, "");
  const waLink = `https://wa.me/${waNumber.startsWith("+") ? waNumber.slice(1) : waNumber}?text=${enc(orderText)}`;

  const flashCopy = `Flash Sale: Use code ${CONFIG.offers.flashSaleCode} every ${CONFIG.offers.flashSaleDay}!`;

  return (
    <div className={dark ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-white text-gray-900"}>
      {/* Top Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-40 h-80 w-80 bg-violet-600/20 blur-3xl rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-gray-900/80 border-b border-gray-700">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 grid place-items-center shadow-lg">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">{CONFIG.brand.name}</p>
              <p className="text-xs opacity-70">{CONFIG.brand.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a href="#menu" className="text-sm opacity-80 hover:opacity-100">Menu</a>
            <a href="#confess" className="text-sm opacity-80 hover:opacity-100">3 AM Confessions</a>
            <a href="#membership" className="text-sm opacity-80 hover:opacity-100">Night Pass</a>
            <div className="hidden sm:flex items-center gap-2">
              <Switch id="theme" checked={dark} onCheckedChange={setDark} />
              <Label htmlFor="theme" className="text-xs">{dark ? "Dark" : "Light"}</Label>
            </div>
            <Button className="rounded-2xl shadow-md" size="sm">
              <Phone className="w-4 h-4 mr-2" /> Call: {CONFIG.brand.phone}
            </Button>
          </div>
        </section>
      </nav>

      {/* Hero */}
      {CONFIG.sections.hero && (
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <NeonBadge>Open 8 PM – 4 AM • {CONFIG.brand.cityTag}</NeonBadge>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Midnight cravings? <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">We got you.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg opacity-80 max-w-xl">
                Curated night‑time snacks, mood menus, and legendary limited drops. When the city sleeps, we deliver vibes.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" className="rounded-2xl" asChild>
                  <a href="#menu"><ShoppingBag className="w-4 h-4 mr-2" /> Browse Menu</a>
                </Button>
               <Button variant="outline" size="lg" className="rounded-2xl border-gray-600" asChild>
            <a
          href={CONFIG.brand.insta}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
            >
            <Instagram className="w-4 h-4 mr-2" />
               midnight_munch.in
               </a>
                </Button>
              </div>
              {CONFIG.sections.flashSale && (
                <div className="mt-6 p-4 rounded-2xl border border-gray-700 bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <BadgePercent className="w-5 h-5" />
                    <p className="text-sm sm:text-base">{flashCopy}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
                <img alt="midnight-hero" className="w-full h-80 object-cover"
                  src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=1600&auto=format&fit=crop" />
              </div>
              <div className="absolute -bottom-6 -left-6 rotate-2">
                <div className="rounded-2xl px-4 py-2 bg-black/60 border border-gray-700 backdrop-blur text-sm">
                  <Clock className="inline w-4 h-4 mr-2" /> Delivery in 30–45 mins (avg)
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
{/* Menu */}
     <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl sm:text-3xl font-bold">Tonight's Menu</h2>
      <Button
        size="sm"
        className="rounded-xl"
        onClick={() => navigate("/dashboard/add-item")}
      >
        Add
      </Button>
    </div>
    <NeonBadge>
      Mystery snack for ₹{CONFIG.offers.mysterySnackPrice}
    </NeonBadge>
  </div>
  <div className="mt-6 grid xl:grid-cols-3 gap-8">
    <div className="xl:col-span-2 space-y-8">
      {menu.map((block) => (
        <div key={block.category}>
          <h3 className="text-lg font-semibold opacity-90 mb-3">{block.category}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {block.items.map((it) => (
              <Card key={it.id} className="rounded-3xl border-gray-700 bg-gray-800 overflow-hidden flex flex-col">
                <img src={it.img} alt={it.name} className="w-full h-40 object-cover" />
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{it.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700">{it.tag}</span>
                  </CardTitle>
                  <CardDescription className="text-sm opacity-80">{it.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between">
                  <div className="font-semibold">{formatINR(it.price)}</div>
                  {/* You can add cart or other action buttons here if needed */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Cart */}
    <Card className="rounded-3xl border-gray-700 bg-gray-800 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> Your Cart
        </CardTitle>
        <CardDescription className="text-sm">
          Checkout happens on WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.length === 0 && (
          <p className="text-sm opacity-70">Cart is empty. Add something tasty!</p>
        )}
        {cart.map((x) => (
          <div
            key={x.id}
            className="flex items-center justify-between gap-2 p-2 rounded-xl border border-gray-700 bg-gray-800"
          >
            <div>
              <p className="text-sm font-medium">{x.name}</p>
              <p className="text-xs opacity-60">{formatINR(x.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="rounded-xl h-8 w-8 border-gray-600"
                onClick={() => dec(x.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm w-6 text-center">{x.qty}</span>
              <Button
                size="icon"
                className="rounded-xl h-8 w-8"
                onClick={() => inc(x.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-xl h-8 w-8 border-gray-600"
                onClick={() => del(x.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-fuchsia-500"
                checked={mystery}
                onChange={(e) => setMystery(e.target.checked)}
              />
              Add Mystery Snack (+₹{CONFIG.offers.mysterySnackPrice})
            </label>
            <div className="text-sm flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {mystery && cart.length > 0 && (
              <div className="text-sm flex justify-between">
                <span>Mystery</span>
                <span>{formatINR(mysteryCost)}</span>
              </div>
            )}
            <div className="text-base font-semibold flex justify-between border-t border-gray-700 pt-2">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="rounded-2xl border-gray-600 w-full"
          onClick={clear}
          disabled={!cart.length}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
        </Button>
        <Button className="rounded-2xl w-full" asChild disabled={!cart.length}>
          <a href={waLink} target="_blank" rel="noreferrer">
            <Wallet className="w-4 h-4 mr-2" /> Order on WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  </div>
</section>
      {/* Confession Wall */}
      {CONFIG.sections.confessionWall && (
        <section id="confess" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold">3 AM Confession Wall</h2>
            <p className="text-sm opacity-70">Anonymous. Stored locally.</p>
          </div>
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            <Card className="rounded-3xl border-gray-700 bg-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Drop a confession</CardTitle>
                <CardDescription className="text-sm">We might feature the best ones on stories (no names).</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={confession} onChange={(e) => setConfession(e.target.value)} placeholder="Type your late-night secret here…" className="min-h-[120px]" />
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-3">
                <Button className="rounded-2xl" onClick={() => {
                  if (!confession.trim()) return;
                  setConfessions([{ text: confession.trim(), ts: Date.now() }, ...confessions]);
                  setConfession("");
                }}>
                  <Send className="w-4 h-4 mr-2" /> Submit
                </Button>
                <Button variant="outline" className="rounded-2xl border-gray-600" onClick={() => setConfessions([])}>Clear all</Button>
              </CardFooter>
            </Card>
            <Card className="rounded-3xl border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base">Latest confessions</CardTitle>
                <CardDescription className="text-sm">Freshest first.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {confessions.length === 0 && <li className="opacity-70">No confessions yet. Be the first!</li>}
                  {confessions.map((c, i) => (
                    <li key={i} className="p-3 rounded-xl border border-gray-700 bg-gray-700/50">
                      <p>{c.text}</p>
                      <p className="mt-2 text-xs opacity-60">{new Date(c.ts).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Membership */}
      {CONFIG.sections.membership && (
        <section id="membership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="rounded-3xl border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">Night Owl Pass</CardTitle>
              <CardDescription className="text-sm">Exclusive perks for frequent munchers.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <li className="p-3 rounded-xl border border-gray-700 bg-gray-700/50">Free delivery on 6 orders/month</li>
                <li className="p-3 rounded-xl border border-gray-700 bg-gray-700/50">Early access to drops</li>
                <li className="p-3 rounded-xl border border-gray-700 bg-gray-700/50">Birthday midnight rescue</li>
                <li className="p-3 rounded-xl border border-gray-700 bg-gray-700/50">Members‑only secret menu</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="rounded-2xl">Join the club</Button>
            </CardFooter>
          </Card>
        </section>
      )}

      {/* FAQ */}
      {CONFIG.sections.faq && (
        <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold">FAQs</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {[
              { q: "Delivery timings?", a: "We operate from 8:00 PM to 4:00 AM — perfect for night owls." },
              { q: "Coverage?", a: `Currently serving ${CONFIG.brand.cityTag}. DM us if you're a bit outside; we'll try.` },
              { q: "Payment?", a: "UPI, cards, cash on delivery — all good." },
              { q: "Hygiene?", a: "FSSAI-compliant kitchen, tamper-proof packaging, gloves + hairnets." },
            ].map((f, i) => (
              <Card key={i} className="rounded-3xl border-gray-700 bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm opacity-80">{f.a}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      {CONFIG.sections.footer && (
        <footer className="border-t border-gray-700 mt-12">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 grid place-items-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{CONFIG.brand.name}</p>
                <p className="text-xs opacity-70">{CONFIG.brand.tagline}</p>
              </div>
            </div>
            <div className="text-sm opacity-80">
              <p>Service area: {CONFIG.brand.cityTag}</p>
              <p>Timings: 8:00 PM – 4:00 AM</p>
            </div>
            <div className="flex justify-start md:justify-end gap-3">
              <Button variant="outline" className="rounded-2xl border-gray-600">
                <Phone className="w-4 h-4 mr-2" /> Call
              </Button>
              <Button variant="outline" className="rounded-2xl border-gray-600">
                <Instagram className="w-4 h-4 mr-2" /> Insta
              </Button>
              <Button className="rounded-2xl">
                <Lock className="w-4 h-4 mr-2" /> Partner with us
              </Button>
            </div>
          </section>
          <p className="text-center text-xs opacity-60 pb-8">
            © {new Date().getFullYear()} {CONFIG.brand.name}. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}