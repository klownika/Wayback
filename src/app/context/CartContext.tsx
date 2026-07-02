import { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      // Verificamos si ya existe el producto con esa talla
      const existingItem = prev.find(
        (item) => item.id === product.id && item.talla === product.talla
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.talla === product.talla
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Aseguramos que el precio sea un número válido al añadirlo
      const price = Number(product.price) || 0;
      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, talla: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.talla === talla)));
  };

  const clearCart = () => setCartItems([]);

  // Cálculo corregido del total: sumamos asegurando que cada precio sea número
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + (price * quantity);
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      totalPrice, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);