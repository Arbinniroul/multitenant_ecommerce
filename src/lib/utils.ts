import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function generateTenateURL(tenantSlug:string){
  return `/tenants/${tenantSlug}`
}
export function formatCurrency(value:string|number) {

                            
  return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits:0
                            }).format(Number(value))
                            
                        }