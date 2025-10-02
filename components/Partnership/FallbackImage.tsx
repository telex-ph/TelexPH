// components/Partnership/FallbackImage.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";

type FallbackImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const FallbackImage = ({ src, alt, width, height, className }: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      // I-update ang placeholder URL para mas maging generic
      onError={() =>
        setImgSrc(`https://placehold.co/${width}x${height}/cccccc/333333?text=${width > 50 ? 'LOGO' : 'ICON'}`)
      }
    />
  );
};

export default FallbackImage;