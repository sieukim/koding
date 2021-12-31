import { useSelector } from 'react-redux';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return <div>{user?.id ?? 'nonono'}</div>;
};

export default HomePage;
