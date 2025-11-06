"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import CandidateScreeningInterface from "@/components/candidateScreening/CandidateScreeningInterface";

export default function CandidatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <CandidateScreeningInterface />
      </div>
    </div>
  );
}
