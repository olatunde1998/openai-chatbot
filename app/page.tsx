"use client";
import Chatbot from "@/components/Chatbot";
import LandingSections from "@/components/LandingSections";

export default function Chat() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingSections />
      <Chatbot/>
    </div>
  );
}
