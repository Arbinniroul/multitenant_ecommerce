import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomCategory } from "../types"
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props{
    open:boolean,
    onOpenChange:(open:boolean)=>void,
    data?:CustomCategory[];
}

export const CategoriesSidebar=({open,onOpenChange,data}:Props)=>{
    const router=useRouter();
    const [parentCategories,setParentCategories]=useState<CustomCategory[] | null>(null);
    const [selectedCategory,setSelectedCategory]=useState<CustomCategory[] | null>(null);

    const handleOpenChange=(open:boolean)=>{
        setSelectedCategory(null);
        setParentCategories(null);
        onOpenChange(open);

    }

    const backgroundColor=selectedCategory?.color || "white";
    const handleCategoryClick=(category:CustomCategory)=>{
        if(category.subcategories && category.subcategories.length>0){
            setParentCategories(category.subcategories as CustomCategory[]);
            setSelectedCategory(category);
        }
        else {
            if(parentCategories && selectedCategory){
                //This is a sibcategory navigate to 
                router.push(`/${selectedCategory.slug}/${category.slug}`)
            }
            else{
                //This is a main category - navigate to/category
                if(category.slug==="all"){
                    router.push(`/`)

                }
                else{
                    router.push(`/${category.slug}`)
                }
            }
            handleOpenChange(false)
        }

    }
     const handleBackClick=()=>{
        if(parentCategories){
            setParentCategories(null);
            setSelectedCategory(null);
        }
     }
    const currentCategories=parentCategories?? data ?? []
    console.log(data,'data')
    return(
        <Sheet onOpenChange={handleOpenChange} open={open}>
            <SheetContent side="left" className="p-0 transition-none" style={{backgroundColor:backgroundColor}}>
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>

                </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {
               true && (
                <button className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={handleBackClick}>
                    <ChevronLeftIcon className="size-4 mr-2"/>

                    Back
                </button>
               )
                }
                {currentCategories.map((category)=>(
                   <button 
                   onClick={()=>handleCategoryClick(category)}
                   key={category.slug} 
                   className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium cursor-pointer"
                 >
                   {category.name}
                   {category.subcategories && category.subcategories.length > 0 && (
                     <ChevronRightIcon className="size-4 " />  
                   )}
                 </button>
                ))}

            </ScrollArea>

            </SheetContent>
        </Sheet>
    )
}