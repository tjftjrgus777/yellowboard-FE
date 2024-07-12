import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom'
import { MAIN_PATH } from "../../../constant";

export default function OAuth() {

    const {token, expirationTime} = useParams();
    const [cookie, setCookie] = useCookies();
  
    const navigate = useNavigate();

    useEffect(() => {

        if (!token || !expirationTime) return;
 
        const now = new Date().getTime();
        const expires = new Date(now + Number(expirationTime) * 1000);

        setCookie('accessToken', token, { expires, path: '/' });
        // setLogin(true);
        navigate('/');
    } , [token])
  return (
   <></>
  )
}
