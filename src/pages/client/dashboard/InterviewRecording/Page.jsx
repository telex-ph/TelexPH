import { Suspense } from "react";
import InterviewRecordingPage from "./InterviewRecordingPage";
const metadata = {
  title: "Client Portal | Interview Recording",
  description: "Client Portal Dashboard - VA Interview Scheduling & Recordings"
};
function Page() {
  return <Suspense fallback={null}>
      <InterviewRecordingPage />
    </Suspense>;
}
export {
  Page as default,
  metadata
};
