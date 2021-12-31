import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const StyledHeader = styled.nav`
  display: flex;
  flex-direction: row;
  padding: 30px;

  .web-title {
    font-size: 30px;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    margin-left: auto;
  }

  li {
    margin: auto 30px;
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <NavLink className="web-title" to="/">
        Koding
      </NavLink>
      <ul>
        <li>
          <a>자유</a>
        </li>
        <li>
          <a>질문</a>
        </li>
        <li>
          <a>취업/진로</a>
        </li>
        <li>
          <a>채용</a>
        </li>
        <li>
          <a>스터디</a>
        </li>
        <li>
          <a>칼럼</a>
        </li>
        <li>
          <a>검색</a>
        </li>
        <li>
          <a>알림</a>
        </li>
        <li>
          <a>로그인</a>
        </li>
        <li>
          <NavLink to="/signup">회원가입</NavLink>
        </li>
      </ul>
    </StyledHeader>
  );
};

export default Header;
