import { Fragment } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { mainLayout, addLayout } from "./components/Layout/Layout"
import routes from "../src/routes"
import { paths } from "./config"

function App() {
    const isLogin = useSelector((state) => state.auth.isLogin)
    // console.log(isLogin)
    return (
        <Routes>
            {routes.map((route) => {
                const Component = route.component
                const MainComponentLayout = route.mainLayout ? mainLayout : null
                const AddComponentLayout = route.addLayout ? addLayout : null
                const protectedRoute = route.protected

                return (
                    <Fragment key={route.path}>
                        {
                            // protectedRoute && !isLogin ? (
                            //     <Route path="*" element={<Navigate to={paths.login} />} />
                            // ) :
                            <Route
                                path={route.path}
                                element={
                                    MainComponentLayout ? (
                                        <MainComponentLayout title={route.title}>
                                            <Component />
                                        </MainComponentLayout>
                                    ) : AddComponentLayout ? (
                                        <AddComponentLayout title={route.title}>
                                            <Component />
                                        </AddComponentLayout>
                                    ) : (
                                        <Component />
                                    )
                                }
                            />
                        }
                    </Fragment>
                )
            })}
        </Routes>
    )
}

export default App
