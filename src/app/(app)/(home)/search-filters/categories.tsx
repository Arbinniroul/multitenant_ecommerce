import { Category } from '@/payload-types';
import React from 'react'
import { CategoryDropDown } from './category-dropDown';

interface categoriesProps{
    data?:any;
}
const Categories = ({data}:categoriesProps) => {
  return (
    <div className='relative w-full '>
        <div className='flex flex-nowrap items-center'>

        {
            data.map((category:Category)=>(
                <div key={category.id}>
                    <CategoryDropDown category={category} isActive={false} isNavigationHovered={false}/>

                </div>
))
}
</div>
    </div>
  )
}

export default Categories