import {ResponseMessage as message} from "../enums/responseMessages";

export const responseHandler = (data?, msg = message.success, statusCode = 200) => {
    return {
        status: statusCode,
        data,
        message: msg,
    }
}