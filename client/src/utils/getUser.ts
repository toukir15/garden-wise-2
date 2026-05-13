"use client";
export const getUser = async () => {
  const user = localStorage.getItem("user") as string;
  return JSON.parse(user);
};
