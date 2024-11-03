import { useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "../services/recentPosts";

export const useGetPosts = ({
  queryTerm,
  searchTerm,
}: {
  queryTerm: string;
  searchTerm: string;
}) => {
  return useQuery(["posts", queryTerm, searchTerm], () =>
    getPosts(queryTerm, searchTerm)
  );
};

export const useGetPost = (postId: string) => {
  return useQuery(["post", postId], () => getPost(postId));
};
