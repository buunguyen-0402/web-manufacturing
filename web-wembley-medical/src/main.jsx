import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "./hooks/index.js"
import { AuthProvider } from "oidc-react"

import App from "./App.jsx"
import store from "./store/store.js"
import "./index.css"
import { oidcConfig } from "./config/oidc.js"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </BrowserRouter>
            </Provider>
        </AuthProvider>
    </React.StrictMode>,
)
