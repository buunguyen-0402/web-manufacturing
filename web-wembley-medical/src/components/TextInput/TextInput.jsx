/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import cl from "classnames"
import { useDebounce } from "@/hooks"
import { handleValidateTextInput } from "@/utils/functions"

function TextInput({ id, label, value, setValue, disabled, className, isError, type = "text", setValidateRows }) {
    const [focus, setFocus] = useState(false)
    const [error, setError] = useState(false)
    const [inputValue, setInputValue] = useState(value || "")
    const debounce = useDebounce(inputValue, 400)

    const handleBlur = () => {
        setFocus(false)
        handleValidateTextInput(isError, setError, inputValue, setValidateRows, id)
    }

    //validate value each time debounce change
    useEffect(() => {
        setValue(debounce, id)
        if (focus) {
            handleValidateTextInput(isError, setError, debounce, setValidateRows, id)
        }
    }, [debounce, id])

    //pass validate in first render if value is valid
    useEffect(() => {
        if (typeof isError === "function" && !isError(debounce)) {
            handleValidateTextInput(isError, setError, debounce, setValidateRows, id)
        }
    }, [])

    return (
        <>
            <div
                data-component="TextInput"
                className={cl(
                    "relative flex gap-2 w-full border-b-2 pb-1",
                    {
                        "border-primary-3": !focus,
                        "border-primary-2": focus,
                        "cursor-not-allowed border-neutron-2": disabled,
                        "border-warning-1": error,
                    },
                    className,
                )}
            >
                <label
                    className={cl("flex flex-shrink-0 items-center transition-all", {
                        "  text-primary-2": focus,
                        " text-neutron-2": !focus & (inputValue.length === 0),
                        " text-neutron-1": !focus && inputValue.length > 0,
                        "cursor-not-allowed": disabled,
                    })}
                >
                    {label}:
                </label>
                <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={disabled}
                    placeholder="Nhập thông tin..."
                    className={cl(" flex flex-grow h-full bg-transparent focus:outline-none", {
                        "cursor-not-allowed": disabled,
                        "text-transparent": !inputValue,
                    })}
                    onFocus={() => setFocus(true)}
                    onBlur={handleBlur}
                />
            </div>
            {error && <span className=" text-warning-1">{error}</span>}
        </>
    )
}

export default TextInput
