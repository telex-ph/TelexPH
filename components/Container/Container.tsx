import React, { ReactNode } from 'react';
import { DEFAULT_MAX_WIDTH_CLASS } from '@/constant/layout';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`${DEFAULT_MAX_WIDTH_CLASS} ${className}`}>
      {children}
    </div>
  );
};

export default Container;