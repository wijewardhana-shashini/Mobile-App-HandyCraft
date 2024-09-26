export const Product = {
  id: 0,
  image: null,
  name: "",
  price: 0,
};

export const Candle = {
  id: 0,
  image: null,
  name: "",
  price: 0,
};

export const PizzaSize = ['S', 'M', 'L', 'XL'];

export const CartItem = {
  id: "",
  product: Product,
  product_id: 0,
  size: "",
  quantity: 0,
};

export const OrderStatusList = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export const OrderStatus = ['New', 'Cooking', 'Delivering', 'Delivered'];

export const Order = {
  id: 0,
  created_at: "",
  total: 0,
  user_id: "",
  status: "",
  order_items: [],
};

export const OrderItem = {
  id: 0,
  product_id: 0,
  products: Product,
  order_id: 0,
  size: "",
  quantity: 0,
};

export const Profile = {
  id: "",
  group: "",
};
