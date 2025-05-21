import Button from "@/components/Button"
import { useSelector } from "react-redux"
import Cookies from "universal-cookie"
import { authActions } from "@/store"
import { useCallApi } from "@/hooks"
import { useDispatch } from "react-redux"
import { authorizationApi } from "@/services/api"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { oidcConfig } from "@/config"
import { useAuth } from "oidc-react"
import Card from "@/components/Card"
import TextInput from "@/components/TextInput"
import { toast } from "react-toastify"

function SETTINGAccount() {
    // const callApi = useCallApi()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const callApi = useCallApi()
    const cookies = new Cookies()

    const user = useSelector((state) => state.auth)
    const [currentUser, setCurrentUser] = useState([])
    const [popup, setPopup] = useState(false)
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [passConfirm, setPassConfirm] = useState("")

    const fetchData = useCallback(() => {
        callApi([authorizationApi.user.getUser()], (res) => {
            setCurrentUser(() => {
                return res?.[0].data.find(
                    (item) =>
                        String(item.userName) === String(user.username) && String(item.roles[0]) === String(user.role),
                )
            })
        })
    }, [callApi])
    useEffect(() => {
        fetchData()
    }, [fetchData])
    // const logOutFunction = useCallback(() => {
    //     const idToken = sessionStorage.getItem("access-token")

    //     callApi(
    //         [authorizationApi.logOut.logout(), authorizationApi.logOut.endSession(idToken, "http://localhost:5173/")],
    //         (res) => {},
    //     )
    // }, [callApi])
    const logOutFunction = useCallback(() => {
        callApi(
            () => authorizationApi.logOut.logout(),
            (res) => {},
        )
    }, [callApi])

    const handleLogOut = async () => {
        cookies.remove(".AspNetCore.Identity.Application", {
            path: "/",
            domain: "wembleyidentity1-gpbcagfxbecghuas.koreacentral-01.azurewebsites.net",
        })
        sessionStorage.clear()
        localStorage.clear()
        logOutFunction()
        dispatch(
            authActions.setLoginState({
                isLogin: false,
                username: "",
                role: "",
            }),
        )
        // window.location.href = `https://wembleyidentity1-gpbcagfxbecghuas.koreacentral-01.azurewebsites.net/connect/endsession?id_token_hint=${userData?.id_token}&post_logout_redirect_uri=${encodeURIComponent("http://localhost:5173/")}`

        // callApi(
        //     [
        //         authorizationApi.logOut.logout(),
        //         authorizationApi.logOut.endSession(userData.id_token, "http://localhost:5173/"),
        //     ],
        //     (res) => {
        //         if (res[0].status === 200) {
        //             window.location.href = window.location.origin
        //         }
        //     },
        // )
        // try {
        //     await signOut({
        //         id_token_hint: userData?.id_token,
        //         post_logout_redirect_uri: window.location.origin + "/logout",
        //     })
        // } catch (e) {
        //     console.log(e)
        // }
    }

    const handleChangePass = () => {
        setPopup(true)
    }

    const handleChange = () => {
        if (String(newPass) !== String(passConfirm)) {
            toast.error("Mật khẩu xác nhận không trùng khớp")
            return
        } else if (String(newPass) !== "" && String(oldPass) !== "" && String(passConfirm) !== "") {
            callApi(
                () =>
                    authorizationApi.user.postPassword({
                        userId: currentUser.id,
                        oldPassword: oldPass,
                        newPassword: newPass,
                        confirmPassword: passConfirm,
                    }),
                fetchData,
                "Thay đổi mật khẩu thành công",
            )
            setPopup(false)
            setOldPass("")
            setNewPass("")
        } else {
            toast.error("Vui lòng nhập đầy đủ thông tin")
            return
        }
    }

    return (
        <div className="relative flex h-full flex-col gap-2">
            <div className="flex items-center h-[6%] w-full">
                <h3 className=" w-[15%]">Người dùng: </h3>
                <h2 className=" w-[85%]">
                    {currentUser?.lastName} {currentUser?.firstName}
                </h2>
            </div>
            <div className="flex items-center h-[6%] w-full">
                <h3 className=" w-[15%]">Mã người dùng: </h3>
                <h2 className=" w-[85%]">{currentUser?.employeeId}</h2>
            </div>
            <div className="flex items-center h-[6%] w-full">
                <h3 className=" w-[15%]">Quyền truy cập: </h3>
                <h2 className=" w-[85%]">{currentUser?.roles?.[0]}</h2>
            </div>

            {user.role === "Admin" && (
                <Button
                    bg={"rgba(240,137,10,0.9)"}
                    className={" h-[6%] w-[30%]"}
                    onClick={() => navigate("/setting/user")}
                >
                    QUẢN LÝ NGƯỜI DÙNG
                </Button>
            )}
            {user.role === "Admin" && (
                <Button
                    bg={"rgba(240,137,10,0.9)"}
                    className={" h-[6%] w-[30%]"}
                    onClick={() => navigate("/setting/page")}
                >
                    QUẢN LÝ PHÂN QUYỀN THAO TÁC
                </Button>
            )}
            {user.role === "Admin" && (
                <Button
                    bg={"rgba(240,137,10,0.9)"}
                    className={" h-[6%] w-[30%]"}
                    onClick={() => navigate("/setting/role")}
                >
                    QUẢN LÝ CHỨC VỤ
                </Button>
            )}
            <Button bg={"rgba(240,137,10,0.9)"} className={" h-[6%] w-[30%]"} onClick={handleChangePass}>
                THAY ĐỔI MẬT KHẨU
            </Button>

            <Button bg={"rgba(233,34,34,0.8)"} className="mt-auto h-[6%] w-[15%]" onClick={handleLogOut}>
                Đăng xuất
            </Button>
            {popup && (
                <Card className=" absolute top-[20%] left-[35%] z-10 flex flex-col h-[40%] w-[30%] items-center justify-around p-2 bg-neutron-4">
                    <h1>Thay đổi mật khẩu</h1>
                    <TextInput
                        id={"Mật khẩu cũ"}
                        label="Mật khẩu cũ"
                        type="password"
                        value={oldPass}
                        setValue={setOldPass}
                    />
                    <TextInput
                        id={"Mật khẩu mới"}
                        label="Mật khẩu mới"
                        type="password"
                        value={newPass}
                        setValue={setNewPass}
                    />
                    <TextInput
                        id={"Xác nhận mật khẩu"}
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={passConfirm}
                        setValue={setPassConfirm}
                    />
                    <Button onClick={handleChange} className={"h-[12%] w-full"}>
                        Xác nhận thay đổi
                    </Button>
                    <Button bg={"rgba(233,34,34,0.9)"} className={"h-[12%] w-full"} onClick={() => setPopup(false)}>
                        Hủy thay đổi
                    </Button>
                </Card>
            )}
        </div>
    )
}

export default SETTINGAccount
