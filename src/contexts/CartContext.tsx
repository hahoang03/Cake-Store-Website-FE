import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from 'react'
import { useAuth } from './AuthContext'

interface CartItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalAmount: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])

  const cartKey = user ? `cart_${user.id}` : null

  /* LOAD CART WHEN USER CHANGE */
  useEffect(() => {
    if (!cartKey) {
      setItems([])
      return
    }

    const stored = localStorage.getItem(cartKey)
    setItems(stored ? JSON.parse(stored) : [])
  }, [cartKey])

  /* SAVE CART */
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(items))
    }
  }, [items, cartKey])

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const exist = prev.find(p => p.productId === item.productId)
      if (exist) {
        return prev.map(p =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(p => p.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    )
  }

  const clearCart = () => {
    setItems([])
    if (cartKey) localStorage.removeItem(cartKey)
  }

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
