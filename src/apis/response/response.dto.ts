import { ResponseCode, ResponseMessage}  from "types/enum";


export default interface ResponseDto {
    code : ResponseCode;
    message : string;
   // message : ResponseMessage
}
