import ForgetPasswordPage from "@/src/components/ForgetPasswordPage";
import Loading from "@/src/components/loading/Loading";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgetPasswordPage />
    </Suspense>
  );
}
