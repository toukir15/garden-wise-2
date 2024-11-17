// @ts-nocheck
"use client";

import { useGetMonthlyPayments, useGetUserActivity } from '@/src/hooks/admin.hook';
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend, XAxis } from 'recharts';

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
    <div>
      <div>
        <h2 className="text-2xl font-medium py-4">User Activity</h2>
        {isUserActivityLoading ? (
          <p>Loading user activity data...</p>
        ) : userActivityError ? (
          <p>Error loading user activity data: {userActivityError.message}</p>
        ) : (
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
        )}
      </div>

      {/* Grid Layout for Posts and Payments Sections */}
      <div className="grid grid-cols-2 mt-8 gap-6">
        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-medium py-4">Monthly Posts</h2>
          {isUserActivityLoading ? (
            <p>Loading monthly posts data...</p>
          ) : userActivityError ? (
            <p>Error loading monthly posts data: {userActivityError.message}</p>
          ) : (
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
          )}
        </div>

        {/* Payments Section */}
        <div>
          <h2 className="text-2xl font-medium py-4">Monthly Payments</h2>
          {isMonthlyPaymentsLoading ? (
            <p>Loading monthly payments data...</p>
          ) : monthlyPaymentsError ? (
            <p>Error loading monthly payments data: {monthlyPaymentsError.message}</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
