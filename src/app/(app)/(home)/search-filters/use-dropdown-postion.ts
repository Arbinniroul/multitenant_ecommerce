import { RefObject } from "react";


export const useDropDownPosition=(
    ref:RefObject< HTMLDivElement | null> | RefObject<HTMLDivElement>
)=>{
const getDropDownPostion=()=>{
    if(!ref.current) return {top:0,left:0};

    const rect=ref.current.getBoundingClientRect();
    const dropDownWidth=240;

    let left=rect.left+window.scrollX;
    let bottom=rect.bottom+window.scrollY;

    if(left+dropDownWidth>window.innerWidth){
        //Align to right edge 
        left=rect.right+window.scrollX-dropDownWidth
        if(left<0){
            left=window.innerWidth-dropDownWidth-16;
        }
    }
   
if(left<0){
    left=16;
}
return {top,left}
}
return {getDropDownPostion}
}