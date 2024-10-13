import { envConfig } from "@/src/config/envConfig";

export const getPosts = async () => {
  const fetchOption = {
    next: {
      tags: ["posts"],
    },
  };
  const res = await fetch(`${envConfig.baseApi}/posts`, fetchOption);
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
