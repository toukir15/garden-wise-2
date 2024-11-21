"use client";
import { useRefreshToken } from "@/src/hooks/auth.hook";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { LiaCheckCircle } from "react-icons/lia";

export default function PaymentSuccessPage() {

  const {mutate: handleRefreshToken, data} = useRefreshToken()
  // useEffect(()=> {
  //   console.log("payment success")
  //   handleRefreshToken()
  // }, [])

  const handleRedirect = () => {
    handleRefreshToken()
  }
  console.log(data)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" bg-[#121212] shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <LiaCheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your payment. Your account has been successfully
          verified, and you can now access all features.
        </p>
        <Link onClick={() => handleRedirect} href={"/"}>
          <Button
            color="success"
            className="w-full text-white font-semibold py-2 px-4 rounded transition"
          >
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
