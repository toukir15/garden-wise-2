import { envConfig } from "@/src/config/envConfig";

export const getPosts = async () => {
  const fetchOption = {
    next: {
      tags: ["posts"],
    },
  };
  // const res = await fetch(`${envConfig.baseApi}/posts`, fetchOption);
  const res = await fetch(
    `https://garden-wise-2-2.onrender.com/api/v1/posts`,
    fetchOption
  );
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
