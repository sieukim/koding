import { StyledBody } from '../../components/presenters/styled/StyledBody';
import BlogContainer from '../../components/containers/blog/BlogContainer';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BlogPage = () => {
  const params = useParams();
  const profileUser = params.nickname;
  const loginUser = useSelector((state) => state.auth.user);

  return (
    <StyledBody>
      <BlogContainer profileUser={profileUser} loginUser={loginUser} />
    </StyledBody>
  );
};

export default BlogPage;
