import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./views/Main";
import Authentication from "./views/Authentication";
import Search from "./views/Search";
import UserP from "./views/User";
import BoardDetail from "./views/Board/Detail";
import BoardWrite from "./views/Board/Write";
import BoardUpdate from "./views/Board/Update";
import Container from "./layouts/Container";
import ChatWindow from './components/ChatWindow';
import PlusButtonItem from './components/PlusButtonItem';
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "constant";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLoginUserStore } from "./stores";
import { GetSignInUserResponseDto } from "./apis/response/user";
import { ResponseDto } from "./apis/response";
import { User } from "./types/interface";
import { getSignInUserRequest } from "./apis";
import OAuth from 'views/Authentication/OAuth';

function App() {

    const { setLoginUser, resetLoginUser, loginUser } = useLoginUserStore();
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);

    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === 'AF' || code === 'NU' || code === 'DBE') {
            resetLoginUser();
            return;
        }
        const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
        setLoginUser(loginUser);
    }

    useEffect(() => {
        if (!cookies.accessToken) {
            resetLoginUser();
            return;
        }
        getSignInUserRequest().then(getSignInUserResponse);
    }, [cookies.accessToken]);

    const handleChatClose = () => {
        setChatOpen(false);
    };

    const handleMenuItemClick = (menuItem: string) => {
        if (menuItem === 'chat') {
            setChatOpen(true);
        } else if (menuItem === 'write') {
            navigate('/board/write');
        } else if (menuItem === 'main') {
            navigate('/');
        }
    };

    return (
        <>
            <Routes>
                <Route element={<Container />}>
                    <Route path={MAIN_PATH()} element={<Main />} />
                    <Route path={AUTH_PATH()} element={<Authentication />} />
                    <Route path='/auth/oauth-response/:token/:expirationTime' element={<OAuth />} />
                    <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
                    <Route path={USER_PATH(':userEmail')} element={<UserP />} />
                    <Route path={BOARD_PATH()}>
                        <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
                        <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
                        <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
                    </Route>
                </Route>
                <Route path='*' element={<h1>404 Not Found</h1>} />
            </Routes>
            {chatOpen && loginUser && <ChatWindow onClose={handleChatClose} username={loginUser.nickname} />}
            {loginUser && <PlusButtonItem onMenuItemClick={handleMenuItemClick} />}
        </>
    );
}

export default App;
