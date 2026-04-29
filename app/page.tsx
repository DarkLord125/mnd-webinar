import type { Metadata } from "next";
import { QuizApp } from "./components/quiz/QuizApp";

export const metadata: Metadata = {
  title: "Can you spot the AI? — MyNextDeveloper",
  description:
    "A quick visual test — can you tell which image is AI? Take the test, then learn how it's done in our 75-minute live session.",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-1 items-stretch justify-center bg-[#faf7f2]">
      <QuizApp />
    </div>
  );
}
