/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react"
import cl from "classnames"
import { toast } from "react-toastify"

function DateInput({ id, label, value, setValue, className, type, inputType = "dateTime-local", dayCompare }) {
    // type dùng để xác định input dayStart hay Dayend; dayCompare dùng để truyền ngày vào và so sánh-> kiểm tra hợp lệ
    const containerRef = useRef()

    const [focus, setFocus] = useState(false)
    const [inputDate, setInputDate] = useState(value)
    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }
    useEffect(() => {
        if (type === "dayStart") {
            if (inputDate <= dayCompare) {
                setValue(inputDate)
            } else {
                toast.error("Ngày kết thúc phải sau ngày bắt đầu")
            }
        } else if (type === "updateTime") {
            setValue(inputDate)
        } else {
            if (inputDate >= dayCompare) {
                setValue(inputDate)
            } else {
                toast.error("Ngày kết thúc phải sau ngày bắt đầu")
            }
        }
    }, [inputDate])
    return (
        <>
            <div
                ref={containerRef}
                data-component="DateInput"
                className={cl(
                    "relative flex gap-2 border-b-2 pb-1 ",
                    {
                        "border-primary-3": !focus,
                        "border-primary-2": focus,
                    },
                    className,
                )}
            >
                <label
                    className={cl(" flex flex-shrink-0 items-center", {
                        " text-primary-2": focus,
                        " text-neutron-1": !focus,
                    })}
                >
                    {label}:
                </label>
                <div className="flex flex-grow h-full items-end">
                    <input
                        type={inputType}
                        className=" block h-full w-full focus:outline-none"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={(e) => setInputDate(e.target.value)}
                        value={value}
                    />
                </div>
            </div>
        </>
    )
}

export default DateInput
