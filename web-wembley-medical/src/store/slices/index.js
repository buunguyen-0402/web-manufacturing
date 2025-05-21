import common from "./common"
import auth from "./auth"

const rootReducer = {
    common,
    auth,
}

export default rootReducer
export * as commonStoreActions from "./common"
export * as authActions from "./auth"
