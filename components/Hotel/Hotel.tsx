import React from 'react'
import SectionHeading from '../Helper/SectionHeading';
import { hotelData } from '@/data/data';
import HotelCard from './HotelCard';

const Hotel = () => {
  return <div className="pt-20 scroll-pb-20">
    {/* Section Heading */}
    <SectionHeading heading="Recommended Hotels"/>
    <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8
    items-center mt-16">
    {/* Hotel Card */}
    {hotelData.map((data) => {
        return (
            <div key={data.id}>
                <HotelCard hotel={data}/>
            </div>
        )
    })}
    </div>
  </div>;
};

export default Hotel