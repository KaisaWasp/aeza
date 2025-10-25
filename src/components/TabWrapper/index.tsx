import React, { ReactNode } from 'react';

interface TabWrapperProps {
  title: ReactNode;
  children: ReactNode;
}

export const TabWrapper: React.FC<TabWrapperProps> = ({ title, children }) => {
  return (
    <div className='flex flex-col gap-[19px]'>
      <div className='w-full h-[43px] rounded-[30px] bg-[#1C202A] flex justify-center items-center'>
        {title}
      </div>
      <div className='p-3.5 bg-[#1C202A]'>
        <div className='p-3.5 bg-[#030712] rounded-[30px] min-h-[400px]'>
          {children}
        </div>
      </div>
    </div>
  );
};
