// import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

import ToggleButtons from "@/components/ToggleButtons"
import { toggleParamater } from "@/utils/constants"

import { ParamaterSettingCreateOrder, ParamaterSettingManageOrder, ParamaterSettingProduct } from ".."

function ParamaterSetting() {
    const [controlStatus, setControlStatus] = useState(0)

    return (
        <div className=" h-full w-full flex flex-col items-center justify-between">
            <ToggleButtons
                CLassName={" h-[5%] w-full"}
                active={controlStatus}
                onClick={setControlStatus}
                titles={toggleParamater}
            />
            {controlStatus === 0 && <ParamaterSettingCreateOrder />}

            {controlStatus === 1 && <ParamaterSettingManageOrder />}

            {controlStatus === 2 && <ParamaterSettingProduct />}
        </div>
    )
}
export default ParamaterSetting
