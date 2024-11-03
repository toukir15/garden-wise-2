import { envConfig } from "@/src/config/envConfig";

export const getPosts = async (queryTerm: string, searchTerm: string) => {
  // Construct the query parameters
  const params = new URLSearchParams();

  if (queryTerm) {
    params.append("queryTerm", queryTerm);
  }

  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }

  // Fetch posts with dynamic query parameters
  const res = await fetch(`${envConfig.baseApi}/posts?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return await res.json();
};
export const getPost = async (postId: string) => {
  const fetchOption = {
    next: {
      tags: ["post"],
    },
  };

  const res = await fetch(`${envConfig.baseApi}/posts/${postId}`, fetchOption);
  return await res.json();
};
