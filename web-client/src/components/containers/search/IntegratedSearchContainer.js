import IntegratedSearchPresenter from '../../presenters/search/IntegratedSearchPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';

const IntegratedSearchContainer = ({ query }) => {
  // 통합 검색 api 호출
  const [integratedSearch] = useAsync(
    () => api.integratedSearch(query),
    [query],
    false,
  );

  return (
    <IntegratedSearchPresenter
      query={query}
      common={
        integratedSearch.success?.data?.common ?? { posts: [], totalCount: 0 }
      }
      question={
        integratedSearch.success?.data?.question ?? { posts: [], totalCount: 0 }
      }
      career={
        integratedSearch.success?.data?.career ?? { posts: [], totalCount: 0 }
      }
      recruit={
        integratedSearch.success?.data?.recruit ?? { posts: [], totalCount: 0 }
      }
      studyGroup={
        integratedSearch.success?.data?.[`study-group`] ?? {
          posts: [],
          totalCount: 0,
        }
      }
      column={
        integratedSearch.success?.data?.column ?? { posts: [], totalCount: 0 }
      }
    />
  );
};

export default IntegratedSearchContainer;
