import React from 'react';
import ChooseHeader from './ChooseHeader';
import ChooseGrid from './ChooseGrid';

const Choose = () => {
  return (
    <div className="pt-20 pb-20 bg-[#f8f8f8] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full border-[80px] border-gray-300"></div>
      </div>

      <div className="w-[90%] lg:w-[85%] xl:w-[80%] mx-auto relative z-10">
        <ChooseHeader />
        <ChooseGrid />
      </div>
    </div>
  );
};

export default Choose;