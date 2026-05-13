import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarks, updateBookmark } from "../services/bookmark";

export const useGetBookmarks = () => {
  return useInfiniteQuery(
    ["bookmarks"],
    ({ pageParam = 1 }) => getBookmarks(pageParam),
    {
      getNextPageParam: (lastPage: any) => {
        const meta = lastPage?.data?.meta;
        if (!meta) return undefined;
        return meta.page * meta.limit < meta.total ? meta.page + 1 : undefined;
      },
    }
  );
};

export const useUpdateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookmarkId,
      postId,
    }: {
      bookmarkId: string;
      postId: string;
    }) => {
      return await updateBookmark(bookmarkId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"], {
        exact: true,
      });
      queryClient.invalidateQueries(["bookmarks"], {
        exact: true,
      });
    },
  });
};
