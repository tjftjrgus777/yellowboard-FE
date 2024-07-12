import ResponseDto from "../response.dto";

export default interface ReIssueResponseDto extends ResponseDto {
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
}
