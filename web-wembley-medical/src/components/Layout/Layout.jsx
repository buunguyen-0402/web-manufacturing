import MainLayout from "./Components/Layouts/MainLayout"
import AddLayout from "./Components/Layouts/AddLayout"

export function mainLayout({ children, title }) {
    return <MainLayout title={title}>{children}</MainLayout>
}

export function addLayout({ children, title }) {
    return <AddLayout title={title}>{children}</AddLayout>
}
