import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"

interface NavbarItem {
  href: string
  children: React.ReactNode
}

interface Props {
  items: NavbarItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-60px)]"> {/* Adjusted height */}
          <div className="flex flex-col">
            {items.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="w-full text-left p-4 hover:bg-black hover:text-white text-black flex items-center text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                {item.children}
              </Link>
            ))}
            
            <div className="mt-auto border-t"> {/* Changed to mt-auto */}
              <Link 
                href={'/sign-in'}
                className="w-full text-left p-4 hover:bg-black hover:text-white text-black flex items-center text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                Log in
              </Link>
              <Link 
                href={'/sign-up'}
                className="w-full text-left p-4 hover:bg-black hover:text-white text-black flex items-center text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                Start Selling
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}