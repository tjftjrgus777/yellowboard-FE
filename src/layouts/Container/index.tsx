import React from 'react';
import {Outlet, useLocation} from "react-router-dom";
import './style.css'
import Header from "layouts/Header";
import Footer from "layouts/Footer";
import {AUTH_PATH} from "../../constant";
import styled from "styled-components";

export default function Container() {

    const {pathname} = useLocation();

    return (
        <>
            {pathname === AUTH_PATH() ?
                <Outlet/>
            :
                <>
                    <Header/>
                    <OutletWrapper>
                        <Outlet/>
                    </OutletWrapper>
                    <Footer/>
                </>
            }
        </>
    )
}

const OutletWrapper = styled.div`
  margin-top: 90px;
`

