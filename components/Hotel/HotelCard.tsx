import React from 'react'
import { FaHeart } from 'react-icons/fa';

type Props = {
    hotel: {
        id: number;
        image: string;
        name: string;
        location: string;
        rating: number;
        reviews: string;
        price: string;
    };
}

const HotelCard = ({ hotel }: Props) => {
  return (
  <div className="relative h-[300px] w-full rounded-lg cursor-pointer group overflow-hidden">
    <div className="absolute top-4 right-4 z-20 bg-white rounded-full text-black flex items-center
    justify-center flex-col">
        <FaHeart className="w-3 h-3" />
    </div>
    {/* Overlay */}
    <div className="absolute inset-0 bg-black opacity-20 z-10"></div>
  </div>
  )
}

export default HotelCard