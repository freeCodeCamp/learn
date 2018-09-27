import React from 'react';
import { Link } from 'gatsby';
import FCCSearch from 'react-freecodecamp-search';

import NavLogo from './components/NavLogo';
import UserState from './components/UserState';

import './header.css';

function Header() {
  return (
    <header>
      <nav id='top-nav'>
        <ul id='top-left-nav'>
          <a className='home-link' href='https://freecodecamp.org'>
            <NavLogo />
          </a>
          <FCCSearch />
        </ul>
        <ul id='top-right-nav'>
          <li className='nav-btn'>
            <Link to='/'>Curriculum</Link>
          </li>
          <li className='nav-btn'>
            <a href='https://forum.freecodecamp.org' target='_blank'>
              Forum
            </a>
          </li>
          <UserState />
        </ul>
      </nav>
    </header>
  );
}

export default Header;
