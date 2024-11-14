import { envConfig } from "@/src/config/envConfig";

export const getPost = async (postId: string) => {
  const fetchOption = {
    next: {
      tags: ["post"],
    },
  };

  const res = await fetch(`${envConfig.baseApi}/posts/${postId}`, fetchOption);
  return await res.json();
};
