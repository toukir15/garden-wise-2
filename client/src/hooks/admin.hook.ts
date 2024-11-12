import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getMonthlyPayments, getPayments, getPosts, getUserActivity, getUsers, updateUser } from "../services/admin";

export const useGetUserActivity = () => {
  return useQuery({
    queryKey: ["admin-dashboard-user-activity"],
    queryFn: async () => {
      return await getUserActivity();
    },
  });
};

export const useGetMonthlyPayments = () => {
  return useQuery({
    queryKey: ["admin-dashboard-monthly-payment"],
    queryFn: async () => {
      return await getMonthlyPayments();
    },
  });
};

export const useGetPayments = () => {
  return useQuery({
    queryKey: ["admin-dashboard-payments"],
    queryFn: async () => {
      return await getPayments();
    },
  });
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["admin-dashboard-posts"],
    queryFn: async () => {
      return await getPosts();
    },
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["admin-dashboard-users"],
    queryFn: async () => {
      return await getUsers();
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (userId) => {
      return await deleteUser(userId);
    },
      // On success, update the cache or re-fetch
      onSuccess: () => {
        queryClient.invalidateQueries(["admin-dashboard-users"], {
          exact: true,
        });
      },
  });
};

export const useUpdateUser = (userId: string) => {
  return useMutation<any, Error, string>({
    mutationFn: async () => {
      return await updateUser(userId);
    },
  });
};


