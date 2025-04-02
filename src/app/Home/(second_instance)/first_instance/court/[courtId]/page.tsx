"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";

const CourtDetailsPage = () => {
  const params = useParams();
  const courtId = params?.courtId as string;
  const router = useRouter();

  const [courtName, setLocalCourtName] = useState<string>("");
  const [userRegion, setUserRegion] = useState<string | null>(null);
  
  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <Breadcrumb
        regionName={userRegion || "Оценки по области"}
        courtName={courtName}
        onCourtBackClick={handleBackClick}
        showHome={true}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4">{courtName}</h2>
      <Dates />
      <Evaluations courtNameId={courtId} />
    </div>
  );
};

export default CourtDetailsPage; 