import { useSelector } from 'react-redux';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return <div>{user?.email ?? 'nonono'}</div>;
};

export default HomePage;
