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
      onError={() =>
        setImgSrc("https://placehold.co/90x40/cccccc/333333?text=Logo")
      }
    />
  );
};

export default FallbackImage;
