import paths from "./paths"

const oidcConfig = {
    authority: import.meta.env.VITE_AUTHORITY_SERVER,
    clientId: import.meta.env.VITE_CLIENT_ID,
    scope: "openid profile native-client-scope IdentityServerApi",
    responseType: "code",
    redirectUri: window.location.origin + paths.signInOidc,
    postLogoutRedirectUri: window.location.origin + "/logout",
    autoSignIn: false,
    automaticSilentRenew: false,
    extraQueryParams: {
        prompt: "login",
    },
}

export { oidcConfig }
