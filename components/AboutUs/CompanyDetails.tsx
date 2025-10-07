import React from 'react';
import { FaFire, FaArrowRight } from 'react-icons/fa';

const DEFAULT_MAX_WIDTH_CLASS = "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION_HEIGHT = {
    hero: "min-h-[90vh] max-h-[850px]",
    standard: "min-h-[600px] max-h-[800px]",
    compact: "min-h-[500px] max-h-[650px]",
    full: "min-h-screen max-h-[1150px]",
} as const;

const DARK_RED_CLASS = 'text-[#a10000]';
const BG_DARK_RED_CLASS = 'bg-[#a10000]';

const CompanyDetails = () => {
    return (
        <div className={`py-12 ${SECTION_HEIGHT.compact}`}>
            <div className={DEFAULT_MAX_WIDTH_CLASS}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="relative bg-white shadow-xl p-4 rounded-xl border-t-4 transform transition duration-300 hover:scale-[1.02] min-h-[200px] flex flex-col justify-between lg:col-span-1 border-t-[#a10000]">
                        <div className="flex items-start mb-2">
                            <FaFire className="text-3xl text-orange-500 mr-2 mt-0" /> 
                            <div className="text-xl text-yellow-400">★★★★★</div>
                        </div>

                        <div className='flex-grow mt-2'>
                            <p className={`text-4xl font-bold my-1 leading-none ${DARK_RED_CLASS}`}>2024</p> 
                            <p className="text-lg font-semibold text-gray-800">
                                Best Performer <br /> Awards
                            </p>
                        </div>
                        <div className={`absolute bottom-[-15px] right-[-15px] w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${BG_DARK_RED_CLASS}`}>
                            <FaArrowRight className="text-white text-base rotate-[-45deg]" />
                        </div>
                    </div>
                    <div className="space-y-4 lg:col-span-1">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Best Business <br /> Support Services
                            </h3>
                            <p className="text-gray-600 mb-2">
                                At Telex Philippines, we provide inovative and cost-efficient outsourcing solutions
                                that help businesses thrive in today&apos;s competitive world.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4 lg:col-span-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Best Feature List <br /> About Us
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            {['Award-Winning Excellence', 'Scalable Solutions', 'Smart Technologies', 'Global Reach', 'Expert Workforce'].map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <span className={`text-lg mr-3 font-bold ${DARK_RED_CLASS}`}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative min-h-[400px] mt-10 lg:mt-0 lg:col-span-2">
                        <img
                            src="images/post1.svg" 
                            alt="Post 1"
                            className="absolute top-0 left-0 w-[90%] h-[300px] object-cover rounded-xl z-10 shadow-lg"
                        />
                        <img
                            src="images/post5.svg"
                            alt="Post 5"
                            className="absolute bottom-0 right-0 w-[60%] h-[200px] object-cover rounded-xl z-20 shadow-xl"
                        />
                    </div>
                    <div className="lg:hidden mt-8 col-span-full flex justify-center">
                        <button className="flex items-center text-gray-900 font-semibold">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 transform transition duration-300 hover:scale-110 shadow-xl ${BG_DARK_RED_CLASS}`}>
                                <FaArrowRight className="text-white text-xl" />
                            </div>
                            View About Us
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;