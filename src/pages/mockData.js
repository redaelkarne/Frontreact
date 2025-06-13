export const featuredProducts = [
  {
    id: 1,
    name: "SCRUNCHY | Tricotine",
    price: "5.00€",
    originalPrice: null,
    promo: true,
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "Dessous de plat en liège gravé | Hautes-Alpes",
    price: "12.00€",
    originalPrice: null,
    promo: true,
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    rating: 0
  },
  {
    id: 3,
    name: "Rose éternelle",
    price: "18.00€",
    originalPrice: null,
    promo: false,
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    rating: 0
  },
  {
    id: 4,
    name: "SOLEA | Pièce unique",
    price: "65.00€",
    originalPrice: "75.00€",
    promo: true,
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    rating: 0
  }
];

export const blogs = [
  {
    id: 1,
    title: "L'inspiration montagnarde dans mes créations",
    date: "15 Mai 2025",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    excerpt: "Comment les paysages des Hautes-Alpes influencent mes choix de couleurs et de matières. Un voyage au cœur de mon processus créatif...",
    category: "Inspiration"
  },
  {
    id: 2,
    title: "DIY : Apprendre les bases du crochet",
    date: "8 Mai 2025",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    excerpt: "Un guide pas-à-pas pour débuter le crochet. Matériel, techniques de base et premiers projets pour créer tes propres accessoires.",
    category: "Tutoriel"
  },
  {
    id: 3,
    title: "Matériaux écologiques : mes choix durables",
    date: "2 Mai 2025",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    excerpt: "Pourquoi je privilégie le liège, le coton bio et les matières naturelles. Un engagement pour une création plus respectueuse de l'environnement.",
    category: "Écologie"
  }
];

export const orders = [
  { id: 1, date: "2024-06-01", total: 34.5, items: 3, status: "Livrée" },
  { id: 2, date: "2024-06-03", total: 12.0, items: 1, status: "En cours" },
  { id: 3, date: "2024-06-04", total: 65.0, items: 1, status: "Annulée" },
  { id: 4, date: "2024-06-05", total: 18.0, items: 2, status: "Livrée" }
];

export const users = [
  {
    id: 1,
    name: "Alice Dupont",
    email: "alice@email.com",
    orders: [
      { id: 1, date: "2024-06-01", total: 34.5, status: "Livrée" },
      { id: 3, date: "2024-06-04", total: 65.0, status: "Annulée" }
    ]
  },
  {
    id: 2,
    name: "Bob Martin",
    email: "bob@email.com",
    orders: [
      { id: 2, date: "2024-06-03", total: 12.0, status: "En cours" }
    ]
  },
  {
    id: 3,
    name: "Chloé Bernard",
    email: "chloe@email.com",
    orders: [
      { id: 4, date: "2024-06-05", total: 18.0, status: "Livrée" }
    ]
  }
];

// Simulate API calls (with delay)
export function fetchProducts() {
  return new Promise(resolve => setTimeout(() => resolve([...featuredProducts]), 500));
}
export function fetchOrders() {
  return new Promise(resolve => setTimeout(() => resolve([...orders]), 500));
}
export function fetchUsers() {
  return new Promise(resolve => setTimeout(() => resolve([...users]), 500));
}
