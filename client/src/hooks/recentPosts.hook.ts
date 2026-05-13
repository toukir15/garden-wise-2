import { useInfiniteQuery } from "@tanstack/react-query";
import { getPost } from "../services/recentPosts";

export const useGetPost = (postId: string) => {
  return useInfiniteQuery(
    ["post", postId],
    ({ pageParam = 1 }) => getPost(postId, pageParam),
    {
      enabled: !!postId,
      getNextPageParam: (lastPage: any) => {
        const { total, page, limit } = lastPage?.meta ?? {};
        if (!total || !page || !limit) return undefined;
        return page * limit < total ? page + 1 : undefined;
      },
    }
  );
};
