import InputBox from 'components/InputBox';
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
import { emailCertificationRequest, idCheckRequest } from 'apis/index1';
import IdCheckRequestDto from 'apis/request/auth/id-check.request.dto';
import IdCheckResponseDto from 'apis/response/auth/id-check.response.dto';
import { ResponseDto } from 'apis/response';
import { ResponseCode } from 'types/enum';
import EmailCertificationRequestDto from 'apis/request/auth/email-certification.request.dto';
import EmailCertificationResponseDto from 'apis/response/auth/email-certification.response.dto';
import { responseBody } from 'types';

export default function SignUp() {
    const idRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const certificationNumberRef = useRef<HTMLInputElement | null>(null);

    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [certificationNumber, setCertificationNumber] = useState<string>('');

    const [isIdError, setIdError] = useState<boolean>(false);
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);

    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');

    const [isIdCheck, setIdCheck] = useState<boolean>(false);

    const signUpButtonClass = id && password && passwordCheck && email && certificationNumber ?
        'primary-button-lg' : 'disable-button-lg';

    const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;

    const navigate = useNavigate();

    const idCheckResponse = (resposneBody: responseBody<IdCheckResponseDto>) =>{
        if (!resposneBody) return;
        const {code} = resposneBody;
        if (code === ResponseCode.VALIDATION_FAILED) alert('아이디를 입력하세요.')
        if (code === ResponseCode.DUPLICATE_EMAIL) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다');
            setIdCheck(false);
        }
        if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if (code !== ResponseCode.SUCCESS) return;

        setIdError(false);
        setIdMessage('사용 가능한 아이디 입니다');
        setIdCheck(true);
    }

    const emailCertificationResponse = (responseBody: responseBody<EmailCertificationResponseDto>) => {

        if (!responseBody) return;
        const { code } = responseBody;

        if (code === ResponseCode.VALIDATION_FAILED) alert('아이디와 이메일을 모두 입력하세요.');
        if (code === ResponseCode.DUPLICATE_EMAIL) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다.');
            setIdCheck(false);
        }
        if (code === ResponseCode.MAIL_FAIL) alert('이메일 전송에 실패했습니다.');
        if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
        if (code === ResponseCode.SUCCESS) return;

        setEmailError(false);
        setEmailMessage('인증번호가 전송되었습니다');
    }

    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        setIdMessage('');
        setIdCheck(false);
    }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
        setPasswordMessage('');

    }

    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);
        setPasswordCheckMessage('');
    }

    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
        setEmailMessage('');
    }

    const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCertificationNumber(value);
        setCertificationNumberMessage('');
    }

    const onIdButtonClickHanlder = () => {
        if (!id) return;
        const requestBody: IdCheckRequestDto ={id};

        idCheckRequest(requestBody).then(idCheckResponse);

    };

    const onEmailButtonClickHanlder = () => {
        if (!id && email) return;
        const checkedEmail = !emailPattern.test(email);
        if (!checkedEmail) {
            setEmailError(true);
            setEmailMessage('이메일 형식이 아닙니다.');
            return;
        }

        const requestBody: EmailCertificationRequestDto = {id, email};
        emailCertificationRequest(requestBody).then(emailCertificationResponse);
    };

    const onCertificationNumberButtonClickHanlder = () => {

    };

    const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onIdButtonClickHanlder();
    }

    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        if (!passwordCheckRef.current) return;
        passwordCheckRef.current.focus();

    }

    const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        if (!emailRef.current) return;
        emailRef.current.focus();

    }
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onEmailButtonClickHanlder();

    }

    const onCertificiationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onCertificationNumberButtonClickHanlder();

    }

    const onSignUpButtonClickHandler = (event: KeyboardEvent<HTMLInputElement>) => {
       

    }

    const onSignInButtonClickHandler = (event: KeyboardEvent<HTMLInputElement>) => {
       navigate('/auth/sign-in')
    };



    return (
        <div id='sign-up-wrapper'>
            <div className='sign-up-image'></div>
            <div className='sign-up-container'>
                <div className='sign-up-box'>
                    <div className='sign-up-title'>{'임대주택 가격 서비스'}</div>
                    <div className='sign-up-content-box'>
                        <div className='sign-up-content-sns-sign-in-box'>
                            <div className='sign-up-content-sns-sign-in-title'>{'SNS 회원가입'}</div>
                            <div className='sign-up-content-sns-sign-in-button-box'>
                                <div className='kakao-sign-in-button'></div>
                                <div className='naver-sign-in-button'></div>
                            </div>
                        </div>
                        <div className='sign-up-content-divider'></div>
                        <div className='sign-up-content-input-box'>
                            {/* <InputBox ref={idRef} title='이이디' placeholder='아이디를 입력해주세요' type='text' value={id} onChange={onIdChangeHandler} isErrorMessage={isIdError} message={idMessage} buttonTitle='중복 확인' onButtonClick={onIdButtonClickHanlder} onKeyDown={onIdKeyDownHandler}/> */}
                            {/* <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호를 입력해주세요' type='password' value={password} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeyDown={onPasswordKeyDownHandler}/> */}
                            {/* <InputBox ref={passwordCheckRef} title='비밀번호 획인' placeholder='비밀번호를 입력해주세요' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeyDown={onPasswordCheckKeyDownHandler}/> */}
                            {/* <InputBox ref={emailRef} title='이메일' placeholder='이메일 주소를 입력헤주세요' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='이메일 인증' onButtonClick={onEmailButtonClickHanlder} onKeyDown={onEmailKeyDownHandler}/> */}
                            {/* <InputBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리르 입력해주세요' type='text' value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle='인증 확인' onButtonClick={onCertificationNumberButtonClickHanlder} onKeyDown={onCertificiationNumberKeyDownHandler}/> */}
                        </div>
                        <div className='sign-up-content-button-box'>
                            {/* <div className={`${signUpButtonClass} full-width`} onClick={onSignUpButtonClickHandler}>{'회원가입'}</div> */}
                            {/* <div className='text-link-lg full-width' onClick={onSignInButtonClickHandler}>{'로그인'}</div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
