import { useEffect, useRef, useState } from "react"
import { getResourceOptionsList } from "@/utils/functions"

import SelectInput from "../../SelectInput/SelectInput"
// hàm chuyển dữ liệu từ dạng gửi từ api thành dạng sử dụng được
function findObjectById(array, itemIdKey, targetId) {
    if (Array.isArray(array) && targetId) return array.find((item) => item[itemIdKey] === targetId[0])
    return undefined
}
function FourSelect({ id, value = [], setValue, list = [], isError, setValidateRows }) {
    const [enterpriseOptionLists, setEnterpriseOptionLists] = useState([])
    const [siteOptionLists, setSiteOptionLists] = useState([])
    const [areaOptionLists, setAreaOptionLists] = useState([])
    const [workcenterOptionLists, setWorkcenterOptionLists] = useState([])
    const [workunitOptionLists, setWorkunitOptionLists] = useState([])

    const [enterpriseValue, setEnterpriseValue] = useState([])
    const [siteValue, setSiteValue] = useState([])
    const [areaValue, setAreaValue] = useState()
    const [workcenterValue, setWorkcenterValue] = useState()
    const [workunitValue, setWorkunitValue] = useState()

    const siteList = useRef()
    const areaList = useRef()
    const workcenterList = useRef()
    const workunitList = useRef()
    // console.log(list)
    // console.log("///////////////")
    // console.log(enterpriseOptionLists)
    // console.log(siteOptionLists)
    // console.log(areaOptionLists)
    // console.log(workcenterOptionLists)
    // console.log("///////////////")
    // console.log(enterpriseValue[0])
    // console.log(siteValue)
    // console.log(areaValue)
    useEffect(() => {
        setEnterpriseOptionLists(getResourceOptionsList(list, "enterpriseId"))
    }, [])
    // tạo options cho site

    useEffect(() => {
        if (findObjectById(list, "enterpriseId", enterpriseValue)) {
            siteList.current = findObjectById(list, "enterpriseId", enterpriseValue).sites
            setSiteOptionLists(getResourceOptionsList(siteList.current, "siteId"))
        }
    }, [enterpriseValue])
    useEffect(() => {
        if (findObjectById(siteList.current, "siteId", siteValue)) {
            areaList.current = findObjectById(siteList.current, "siteId", siteValue).areas
            setAreaOptionLists(getResourceOptionsList(areaList.current, "areaId"))
        }
    }, [siteValue])
    useEffect(() => {
        if (findObjectById(areaList.current, "areaId", areaValue)) {
            workcenterList.current = findObjectById(areaList.current, "areaId", areaValue).workCenters
            setWorkcenterOptionLists(getResourceOptionsList(workcenterList.current, "absolutePath"))
        }
    }, [areaValue])
    return (
        <>
            <SelectInput
                label="Doanh nghiệp"
                list={enterpriseOptionLists}
                value={enterpriseValue}
                setValue={setEnterpriseValue}
            />
            <SelectInput label="Địa điểm" list={siteOptionLists} value={siteValue} setValue={setSiteValue} />
            <SelectInput label="Khu vực" list={areaOptionLists} value={areaValue} setValue={setAreaValue} />
            <SelectInput
                label="Trung tâm sản xuất"
                list={workcenterOptionLists}
                id={id}
                setValidateRows={setValidateRows}
                value={value}
                setValue={setValue}
            />
        </>
    )
}

export default FourSelect
