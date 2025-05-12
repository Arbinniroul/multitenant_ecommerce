"use client"

import React, { useEffect, useRef, useState } from 'react'
import { CategoryDropDown } from './category-dropDown';
import { CustomCategory } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListFilterIcon } from 'lucide-react';
import { CategoriesSidebar } from './categories-sidebar';

interface CategoriesProps {
    data?: CustomCategory[];
}

const Categories = ({ data = [] }: CategoriesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);

  const activeCategory = "all";

  const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory);
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;
      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        console.log('width',width);
        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

     

      
      setVisibleCount(visible);
    };
    const resizeObserver = new ResizeObserver(calculateVisible);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }




    return () => resizeObserver.disconnect();
  }, [data.length]);
  console.log(visibleCount,'afterChange')

  return (
    <div className='relative w-full' >

      {/* Categories sidebar */}
     <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
      {/* Hidden measurement container */}
      <div 
        ref={measureRef} 
        className='absolute opacity-0 pointer-events-none flex' 
        style={{ position: 'fixed', top: '-9999px', left: '-9999px ' }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropDown 
              category={category} 
              isActive={activeCategory === category.slug} 
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      {/* Visible Items */}
      <div 

        className='flex flex-nowrap items-center' 
        ref={containerRef} 
        onMouseEnter={() => setIsAnyHovered(true)} 
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropDown 
              category={category} 
              isActive={activeCategory === category.slug} 
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

<div ref={viewAllRef} className="shrink-0">
          <Button variant={'elevated'} className={cn(
            "h-11 px-4 transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary"

          )} onClick={()=>setIsSidebarOpen(true)}>
            View All 
            <ListFilterIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>

      {/* View All button */}


    </div>
  )
}

export default Categories;