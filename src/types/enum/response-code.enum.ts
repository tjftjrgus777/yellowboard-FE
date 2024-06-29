enum ResponseCode {

    //Http Status 200
    SUCCESS = "SU",

    //Http Status 400 - Bad Request : 잘못된 요청
    DUPLICATE_EMAIL = "DE",
    VALIDATION_FAILED = "VF",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TEL_NUMBER = "DT",
    NOT_EXISTED_USER = "NU",
    NOT_EXISTED_BOARD = "NB",

    //Http Status 401 - Unauthorized : 비인증(인증 수단이 없음)
    SIGN_IN_FAIL = "SF",
    AUTHORIZATION_FAIL = "AF",

    //Http Status 403 - Forbidden : 권한 없음 (서버가 요청을 이해했지만 승인을 거부)
    NO_PERMISSION = "NP",

    //Http Status 500 - Internal Server Error
    DATABASE_ERROR = "DBE",

    // 인증 실패
    CERTIFICATION_FAIL = "CF"

}

export default ResponseCode;
