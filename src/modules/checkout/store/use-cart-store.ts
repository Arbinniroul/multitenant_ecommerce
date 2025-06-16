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

}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},
      
addProduct: (tenantSlug, productId) => {
  return set((state) => {
    const currentCart = state.tenantCarts[tenantSlug] || { productIds: [] };
   
    if (currentCart.productIds?.includes(productId)) {
      return state;
    }
    return {
      tenantCarts: {
        ...state.tenantCarts,
        [tenantSlug]: {
          productIds: [...(currentCart.productIds ?? []), productId]
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
      
    
    }),

{
  name: "funroad-cart",
  storage: createJSONStorage(() => localStorage),
  migrate: (persistedState,) => { 
    return persistedState as CartState 
  }
}
  )
);