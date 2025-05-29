import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds?: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void; 
  clearAllCarts: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      
  addProduct: (tenantSlug, productId) => {
        return set((state) => {
          const currentCart = state.tenantCarts[tenantSlug] || { productIds: [] };
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: [...currentCart.productIds, productId]
              }
            }
          };
              });
      },
      removeProduct: (tenantSlug, productId) =>
        set((state) => {
          const currentProducts = state.tenantCarts[tenantSlug]?.productIds || [];
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: currentProducts.filter(id => id !== productId)
              }
            }
          };
        }),
      
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: []
            }
          }
        })),
      
      clearAllCarts: () =>
        set(() => ({
          tenantCarts: {}
        })),
      
      getCartByTenant: (tenantSlug) => 
        get().tenantCarts[tenantSlug]?.productIds || []
    }),
    {
      name: "funroad-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);