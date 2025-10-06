import React from 'react';
import ChooseContent from './ChooseContent';

const Choose = () => {
  return (
    <div
      id="choose"
      className="pt-20 pb-20 bg-white relative overflow-hidden"
    >
      {/* Background Pattern - Responsive */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
        <div className="absolute top-10 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-[60px] sm:border-[80px] border-gray-300"></div>
      </div>

      <div className="w-[90%] lg:w-[85%] xl:w-[80%] mx-auto relative z-10">
        <ChooseContent />
      </div>
    </div>
  );
};

export default Choose;
