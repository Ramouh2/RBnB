import type { Metadata } from "next";
import { MotionPlayground } from "@/components/playground/MotionPlayground";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Motion Lab",
  description: "Laboratoire interactif de calibration du Motion Design System de RBnB.",
};

export default function MotionPlaygroundPage() {
  return (
    <>
      <SiteHeader />
      <MotionPlayground />
    </>
  );
}
