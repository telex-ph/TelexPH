import React from "react";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
import { FONT_CLASSES } from "@/constant/styles";

const FooterBottom = () => {

    return (
        <div 
            className={`border-t border-gray-700 mt-0 py-4 px-6 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between mx-auto ${DEFAULT_MAX_WIDTH_CLASS} ${FONT_CLASSES.rubikRegular}`}
        >
            {/* Left side */}
            <div>
                © Copyright 2025 by 
                <span className={`text-white ${FONT_CLASSES.openSansBold}`}> TelexPH</span>
            </div>

            {/* Right side */}
            <div className="flex space-x-6 mt-2 md:mt-0">
                <a href="#" className={`hover:text-white transition ${FONT_CLASSES.rubikRegular}`}>Privacy policy</a>
                <a href="#" className={`hover:text-white transition ${FONT_CLASSES.rubikRegular}`}>Terms and Condition</a>
            </div>
        </div>
    );
};

export default FooterBottom;