import React from "react"

function ToggleButtons({ titles, onClick, active, CLassName }) {
    return (
        <>
            <div className={`toggle-buttons-container flex flex-row items-center justify-center ${CLassName}`}>
                {titles.map((item, index) => {
                    return (
                        <div
                            type="button"
                            key={index}
                            className={`toggle-buttons-button h-full first:rounded-l-lg last:rounded-r-lg ${
                                active === index
                                    ? " bg-gradient-to-r from-primary-2 via-[#83A6CE] via-50% to-primary-2 text-neutron-4"
                                    : "bg-neutron-4 text-primary-1"
                            } first-child:rounded-xl flex flex-grow cursor-pointer list-none flex-row items-center justify-center overflow-hidden  !border !border-primary-1 text-2xl font-extrabold shadow-type1 transition-all duration-100 ease-in-out hover:bg-primary-2 hover:text-neutron-4 active:bg-primary-1`}
                            onClick={() => onClick(index)}
                        >
                            {item}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ToggleButtons
