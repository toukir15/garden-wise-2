// @ts-nocheck
"use client";

import ChartBarLoading from "@/src/components/loading/ChartBarLoading";
import UserActivityBarLoading from "@/src/components/loading/UserActivityBarLoading";
import YearButton from "@/src/components/shared/Dashboard/YearButton";
import {
  useGetMonthlyPayments,
  useGetUserActivity,
} from "@/src/hooks/admin.hook";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
} from "recharts";

export default function Page() {
  const {
    data: userActivityData,
    isLoading: isUserActivityLoading,
    error: userActivityError,
  } = useGetUserActivity();

  const {
    data: monthlyPaymentsData,
    isLoading: isMonthlyPaymentsLoading,
    error: monthlyPaymentsError,
  } = useGetMonthlyPayments();

  return (
    <div className="p-4">
      <div>
        <h2 className="xl:text-3xl text-xl font-bold text-gray-700 py-4">
          User Activity
        </h2>
        <div className="overflow-x-auto mt-6">
          {isUserActivityLoading ? (
            // Skeleton loader for the chart
            <UserActivityBarLoading />
          ) : userActivityError ? (
            <p>Error loading user activity data: {userActivityError.message}</p>
          ) : (
            <div className="min-w-[800px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userActivityData?.data.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="upvotes" fill="#8884d8" name="Upvotes" />
                  <Bar dataKey="downvotes" fill="#82ca9d" name="Downvotes" />
                  <Bar dataKey="posts" fill="#ffc658" name="Posts Created" />
                  <Bar dataKey="comments" fill="#ff7300" name="Comments Made" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout for Posts and Payments Sections */}
      <div className="xl:grid xl:grid-cols-2 mt-8 gap-6">
        {/* Posts Section */}
        <div>
          <h2 className="xl:text-3xl text-xl font-bold text-gray-700 py-4">
            Monthly Posts
          </h2>
          {/* <YearButton /> */}
          <div className="overflow-x-auto mt-6">
            {isUserActivityLoading ? (
              <ChartBarLoading />
            ) : userActivityError ? (
              <p>
                Error loading monthly posts data: {userActivityError.message}
              </p>
            ) : (
              <div className="min-w-[650px]">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={userActivityData?.data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Payments Section */}
        <div>
          <h2 className="xl:text-3xl text-xl font-bold text-gray-700 py-4">
            Monthly Payments
          </h2>
          {/* <YearButton /> */}
          <div className="overflow-x-auto mt-6">
            {isMonthlyPaymentsLoading ? (
              <ChartBarLoading />
            ) : monthlyPaymentsError ? (
              <p>
                Error loading monthly payments data:{" "}
                {monthlyPaymentsError.message}
              </p>
            ) : (
              <div className="min-w-[650px]">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyPaymentsData?.data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="payments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
