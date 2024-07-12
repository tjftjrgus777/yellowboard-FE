import ResponseDto from "../response.dto";

export default interface SignInResponseDto extends ResponseDto {
    nickname: string;
    accessToken: string;
    expirationTime: number;
    userRole: string;
    refreshToken: string;
    grantType: string;
}
