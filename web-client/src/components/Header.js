import styled from 'styled-components';
import { NavLink, useMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../modules/api';
import { useCallback } from 'react';
import { setLogout } from '../modules/auth';
import { MyPageLink } from '../utils/MyComponents';
import SearchBar from '../utils/SearchBar';

const StyledHeader = styled.nav`
  display: flex;
  flex-direction: row;
  padding: 30px;
  justify-content: space-between;

  .web-title {
    font-size: 30px;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
  }

  li {
    margin: auto 30px;
  }
`;

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  /* 로그 아웃 */

  const dispatch = useDispatch();

  // 로그 아웃 api 호출하는 함수
  const logout = useCallback(async () => {
    try {
      const onSetLogout = () => dispatch(setLogout());
      await api.logout();
      onSetLogout();
    } catch (e) {
      alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, []);

  /* 검색 */

  const match = useMatch('/search');

  return (
    <StyledHeader>
      <NavLink className="web-title" to="/">
        Koding
      </NavLink>
      {!match && <SearchBar className="header" />}
      <ul>
        <li>
          <NavLink to="/board/common">일반</NavLink>
        </li>
        <li>
          <NavLink to="/board/question">질문</NavLink>
        </li>
        <li>
          <NavLink to="/board/career">취업/진로</NavLink>
        </li>
        <li>
          <NavLink to="/board/recruit">채용</NavLink>
        </li>
        <li>
          <NavLink to="/board/study-group">스터디</NavLink>
        </li>
        <li>
          <NavLink to="/board/column">칼럼</NavLink>
        </li>
        {!user && (
          <li>
            <NavLink to="/login">로그인</NavLink>
          </li>
        )}
        {user && (
          <>
            <li>
              <NavLink to={`/user/${user.nickname}/notification`}>알림</NavLink>
            </li>
            <li>
              <MyPageLink nickname={user.nickname} str={'마이페이지'} />
            </li>
            <li>
              <button onClick={logout}>로그아웃</button>
            </li>
          </>
        )}
      </ul>
    </StyledHeader>
  );
};

export default Header;
