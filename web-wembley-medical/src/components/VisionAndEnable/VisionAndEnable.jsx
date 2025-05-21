import Card from "../Card"
import cl from "classnames"
import Button from "../Button"

function VisionAndEnable({ data, visionProcessing = [], enableStation = [], setControl }) {
    return (
        <>
            <div
                className=" flex justify-between items-center h-[60%] w-full bg-neutron-4 cursor-pointer hover:bg-primary-4 p-2"
                onClick={() => setControl(1)}
            >
                {visionProcessing.length >= 0 && (
                    <div className={" flex flex-col items-center w-[49%] h-full "}>
                        <h4>Thông số máy</h4>
                        <div className=" flex flex-col items-center w-full gap-2 p-1 overflow-y-scroll">
                            {visionProcessing.map((res, index) => (
                                <div
                                    key={index}
                                    className=" w-full h-fit p-1 flex border border-collapse border-neutron-2 rounded-xl gap-1"
                                >
                                    <p className=" w-[80%] break-words">{res.name}:</p>
                                    <h7>{data && data[`${res.tagId}`] ? String(data[`${res.tagId}`].TagValue) : 0}</h7>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className=" h-[80%] w-[0.2%] bg-neutron-2 rounded-2xl"></div>
                {enableStation.length >= 0 && (
                    <div className={"flex flex-col items-center w-[48%] h-full"}>
                        <h4>Trạng thái sử dụng các trạm</h4>
                        <div className="flex flex-col items-center w-full gap-2 overflow-y-scroll">
                            {enableStation.map((res, index) => (
                                <div
                                    key={index}
                                    className={cl(
                                        " w-full h-fit p-1 flex border border-collapse border-neutron-2 rounded-xl gap-1",
                                        {
                                            "bg-[rgba(0,245,16,0.7)]":
                                                data && data[`${res.tagId}`]
                                                    ? Number(data[`${res.tagId}`].TagValue)
                                                    : 0,
                                        },
                                    )}
                                >
                                    <p className=" w-[85%] break-words">{res.name}:</p>
                                    <p className=" font-semibold">
                                        {" "}
                                        {data && data[`${res.tagId}`]
                                            ? Number(data[`${res.tagId}`].TagValue)
                                                ? "Bật"
                                                : "Tắt"
                                            : "Tắt"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default VisionAndEnable
