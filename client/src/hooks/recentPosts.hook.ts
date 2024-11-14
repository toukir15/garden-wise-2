import { useQuery } from "@tanstack/react-query";
import { getPost } from "../services/recentPosts";

export const useGetPost = (postId: string) => {
  return useQuery(["post", postId], () => getPost(postId));
};
