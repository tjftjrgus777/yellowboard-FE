import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useCookies } from 'react-cookie';

interface Props {
  onMenuItemClick: (menuItem: string) => void;
}

export default function PlusButtonItem({ onMenuItemClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(['accessToken']);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (menuItem: string) => {
    if (!cookies.accessToken) {
      navigate('/auth');
      return;
    }

    onMenuItemClick(menuItem);
    setMenuOpen(false);
  };

  return (
    <div className='plus-button-container'>
      <button className='plus-button' onClick={toggleMenu}>+</button>
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        <div className='menu-items'>
          <div className='menu-item' onClick={() => handleMenuItemClick('main')}>메인</div>
          <div className='menu-item' onClick={() => handleMenuItemClick('write')}>게시글 작성</div>
          <div className='menu-item' onClick={() => handleMenuItemClick('chat')}>채팅</div>
        </div>
      </div>
    </div>
  );
}
