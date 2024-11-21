import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarks, updateBookmark } from "../services/bookmark";

export const useGetBookmarks = () => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      return await getBookmarks();
    },
  });
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
