import type { Metadata } from "next";
import { Playbook } from "./Playbook";

export const metadata: Metadata = {
  title: "AI Adoption Playbook — from idea to governed production",
  description:
    "A visual, evidence-gated path to introduce AI in independent work, small businesses, nonprofits, and public services.",
};

export default function Home() {
  return <Playbook locale="en" />;
}
