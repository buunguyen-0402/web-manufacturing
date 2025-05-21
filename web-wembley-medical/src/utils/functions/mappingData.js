import { convertDateFormat } from "./dateTime"

export const SETTINGUserMapper = {
    apiToClient: (data) => {
        let res = data.map((item) => {
            return {
                ...item,
                dateOfBirth: convertDateFormat(item.dateOfBirth),
            }
        })
        return res
    },
}
