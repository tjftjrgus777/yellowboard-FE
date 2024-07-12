import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css'
import defaultProfileImage from 'assets/image/default-profile-image.png'
import {useNavigate, useParams} from 'react-router-dom';
import {BoardListItem} from "../../types/interface";
import BoardItem from "../../components/BoardItem";
import {BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH} from "../../constant";
import {useLoginUserStore} from "../../stores";
import {
    fileUploadRequest,
    getUserBoardListRequest,
    getUserRequest,
    patchNicknameRequest,
    patchProfileImageRequest
} from "../../apis";
import {GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto} from "../../apis/response/user";
import {ResponseDto} from "../../apis/response";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "../../apis/request/user";
import {useCookies} from "react-cookie";
import {usePaginaion} from "../../hooks";
import Pagination from "../../components/Pagination";
import {GetUserBoardListResponseDto} from "../../apis/response/board";

export default function UserPage() {

    const {userEmail} = useParams();
    const {loginUser} = useLoginUserStore();
    const [cookies, setCookies] = useCookies();

    const [isMyPage, setMyPage] = useState<boolean>(true);

    const navigate = useNavigate();

    const UserTop = () => {

        const imageInputRef = useRef<HTMLInputElement | null>(null);
        const [isNicknameChange, seteNicknameChange] = useState<boolean>(false);

        const [nickname, setNickname] = useState<string>('');
        const [changeNickname, setChangeNickname] = useState<string>('');
        const [profileImage, setProfileImage] = useState<string | null>(null);

        const fileUploadResponse = (profileImage: string | null) => {
            if (!profileImage) return;
            if (!cookies.accessToken) return;

            const requestBody: PatchProfileImageRequestDto = {profileImage};
            patchProfileImageRequest(requestBody).then(patchProfileImageReseponse);
        }

        const patchProfileImageReseponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if (!responseBody) return;

            const {code} = responseBody;
            if (code === 'AF') alert('인증에 실패했습니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            console.log(responseBody);

            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
        }
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files.length) return;

            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);

            fileUploadRequest(data).then(fileUploadResponse);
        }
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!imageInputRef) return;
            imageInputRef.current?.click();
        }

        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setChangeNickname(value);
        }
        const onNickNameEditButtonClickHandler = () => {
            if (!isNicknameChange) {
                setChangeNickname(nickname);
                seteNicknameChange(!isNicknameChange);
                return;
            }

            if (!cookies.accessToken) return;
            const requestBody: PatchNicknameRequestDto = {
                nickname: changeNickname
            };
            patchNicknameRequest(requestBody).then(patchNicknameResponse);
        }

        const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
            if (!responseBody) return;

            const {code} = responseBody;
            if (code === 'VF') alert('닉네임은 필수입니다');
            if (code === 'AF') alert('인증에 실패했습니다.');
            if (code === 'DN') alert('중복된 닉네임입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
            seteNicknameChange(false);
        }
        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;

            const {code} = responseBody;
            if (code === 'NU') alert('존재하지 않는 유저입니다.')
            if (code === 'DBE') alert('데이터베이스 오류입니다ㅏ')
            if (code !== 'SU') {
                navigate(MAIN_PATH());
                return;
            }

            const {email, nickname, profileImage} = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImage(profileImage);

            const isMyPage = email === loginUser?.email
            setMyPage(isMyPage);
        }

        useEffect(() => {
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
        }, [userEmail]);

        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ?
                        <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                            {profileImage !== null ?
                                <div className='user-top-profile-image'
                                     style={{backgroundImage: `url(${profileImage})`}}>
                                </div>
                                :
                                <div className='icon-box-large'>
                                    <div className='icon image-box-white-icon'></div>
                                </div>
                            }

                            <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}}
                                   onChange={onProfileImageChangeHandler}
                            />
                        </div>
                        :
                        <div className='user-top-profile-image-box'
                             style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ?
                                <>
                                    {isNicknameChange ?
                                        <input className='user-top-info-nickname-input' type='text'
                                               size={changeNickname.length + 5} value={changeNickname}
                                               onChange={onNicknameChangeHandler} autoFocus/>
                                        :
                                        <div className='user-top-info-nickname'>{nickname}</div>
                                    }
                                    <div className='icon-button' onClick={onNickNameEditButtonClickHandler}>
                                        <div className='icon edit-icon'></div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className='user-top-info-nickname'>{nickname}</div>
                                </>
                            }
                        </div>
                        <div className='user-top-info-email'>{userEmail}</div>
                    </div>
                </div>
            </div>
        );
    };

    const UserBottom = () => {

        const [count, setCount] = useState<number>(1);

        const {
            currentPage,
            setCurrentPage,
            currentSection,
            setCurrentSection,
            viewList,
            viewPageList,
            totalSection,
            setTotalList
        } = usePaginaion<BoardListItem>(5);

        const onSideCardClickHandler = () => {
            if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if (loginUser) {
                navigate(USER_PATH(loginUser.email))
            }
            ;
        }

        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;

            if(code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                navigate(MAIN_PATH());
                return;
            }

            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { userBoardList } = responseBody as GetUserBoardListResponseDto;
            setTotalList(userBoardList);
            setCount(userBoardList.length);
        }

        useEffect(() => {
            if(!userEmail) return;
            getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
        }, [userEmail]);


        return (
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    <div className='user-bottom-title'>{isMyPage ? '내 게시물 ' : '게시물 '}<span
                        className='emphasis'>{count}</span></div>
                    <div className='user-bottom-contents-box'>
                        {
                            count === 0 ?
                                <div className='user-bottom-contents-nothing'>{'게시물이 없습니다'}</div> :
                                <div className='user-bottom-contents'>
                                    {viewList.map((boardListItem, index) => <BoardItem key={index}
                                                                                            boardListItem={boardListItem}/>)}
                                </div>
                        }
                        <div className='user-bottom-side-box'>
                            <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                                <div className='user-bottom-side-container'>
                                    {isMyPage ?
                                        <>
                                            <div className='icon-box'>
                                                <div className='icon edit-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-test'>{'글쓰기'}</div>
                                        </>
                                        :
                                        <>
                                            <div className='user-bottom-side-test'>{'내 게시물로 가기'}</div>
                                            <div className='icon-box'>
                                                <div className='icon arrow-right-icon'></div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-bottom-pagination-box'>
                        {count !== 0 &&
                            <Pagination
                                currentPage={currentPage}
                                currentSection={currentSection}
                                setCurrentPage={setCurrentPage}
                                setCurrentSection={setCurrentSection}
                                viewPageList={viewPageList}
                                totalSection={totalSection}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <UserTop/>
            <UserBottom/>
        </div>
    )
}
