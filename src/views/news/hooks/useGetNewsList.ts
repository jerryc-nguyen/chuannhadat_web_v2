import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';



function useNewsData() {

  return useQuery({
    queryKey: ['get-news'],
    queryFn: services.news.getNews,
    select: (data) => data.data,
  });
}
export default useNewsData;
