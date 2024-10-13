import { useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "../services/recentPosts";

export const useGetPosts = () => {
  return useQuery(["posts"], getPosts);
};

export const useGetPost = (postId: string) => {
  return useQuery(["post", postId], () => getPost(postId));
};
