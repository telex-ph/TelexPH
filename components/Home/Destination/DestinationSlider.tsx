"use client";
import React from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { destinationData } from "../../../data/data";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1324 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1324, min: 764 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
  },
};

const DestinationSlider = () => {
  return (
    <Carousel
      responsive={responsive}
      infinite
      autoPlay
      autoPlaySpeed={5000}
      keyBoardControl
      itemClass="px-2"
      containerClass="py-2" 
    >
      {destinationData.map((data) => (
        <div
          key={data.id}
          className="relative h-[400px] rounded-lg overflow-hidden"
        >
          {/* Image */}
          <Image
            src={`/${data.image}`} 
            alt={data.country}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text Content */}
          <div className="absolute bottom-5 left-5 text-white z-10">
            <h3 className="text-lg font-bold">{data.country}</h3>
            <p>{data.travelers} travelers</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default DestinationSlider;
