"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import UserProvider from "@/src/context/user.provider";
import { PostProvider } from "@/src/context/post.provider";
import SocketProvider from "@/src/context/socket.provider";
import { socket } from "@/src/socket";

// Create a client
const queryClient = new QueryClient();

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  // socket listener
  React.useEffect(() => {
    const handleDisconnect = (data: any) => {
    };

    socket.on("disconnectUser", handleDisconnect);

    // Clean up the event listener on component unmount
    return () => {
      socket.off("disconnectUser", handleDisconnect);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SocketProvider>
          <PostProvider>
            <NextUIProvider navigate={router.push}>
              <Toaster />
              <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </NextUIProvider>
          </PostProvider>
        </SocketProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
