"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useRef, useState } from "react";
import { useDropDownPosition } from "./use-dropdown-postion";
import SubCategoryMenu from "./SubCategoryMenu";

interface Props{
    category:Category,
    isActive?:boolean,
    isNavigationHovered?:boolean

}

export const CategoryDropDown=({category,isActive,isNavigationHovered}:Props)=>{
    const[isOpen,setIsOpen]=useState(false);
    const dropDownRef=useRef<HTMLDivElement>(null);
    const {getDropDownPostion}=useDropDownPosition(dropDownRef)
    const dropdownPostion=getDropDownPostion();
    const onMouseEnter=()=>{
        if(category.subcategories){
            setIsOpen(true);
        }
    }
    const onMouseLeave=()=>{
        setIsOpen(false)
    }
    return(
<div className="relative " ref={dropDownRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <div className="relative ">


        <Button variant={'elevated'} className={cn("h-11 px-4 transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",isActive && !isNavigationHovered && "bg-white border-primary")}>{category.name}</Button>
        {
             category.subcategories && category.subcategories.length>0 && (
                <div className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-r-[10px]  border-r-transparent border-l-transparent border-l-[10px] border-b-[10px] border-b-black left-1/2 -translate-x-1/2 ",
                    isOpen && "opacity-100"
                )}>


                    </div>

            )
        }
    </div>
    <SubCategoryMenu 
    category={category}
    isOpen={isOpen}
    position={dropdownPostion}
    />
</div>
    )
}