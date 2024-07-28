"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  // used to get interview details by mockid/interviewid
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    console.log(result);

    setInterviewData(result[0]);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            {/* here interviewData.position will come but its giving error so setInterviewData.position is passed for temporary purpose same for  jobDesc and jobExperience */}
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {setInterviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack: </strong>
              {setInterviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
              {setInterviewData.jobExperience}
            </h2>
          </div>

          <div className="p-5 border rounded-lg border-yellow-500 bg-yellow-100">
            <h2 className="flex gap-2 items-center">
              <Lightbulb />
              <strong>Information:</strong>
            </h2>
            <h2 className="mt-3">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div className="">
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setWebcamEnabled(true)}
              >
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end items-end">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;

// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { MockInterview } from "@/utils/schema";
// import { WebcamIcon } from "lucide-react";
// import Webcam from "react-webcam";
// import { db } from "@/utils/db"; // Ensure you import db correctly
// import { eq } from "drizzle-orm"; // Use the correct import for eq

// function Interview({ params }) {
//   const [interviewData, setInterviewData] = useState(null); // Initialize with null
//   const [webcamEnabled, setWebcamEnabled] = useState(false);

//   useEffect(() => {
//     console.log(params.interviewId);
//     GetInterviewDetails();
//   }, [params.interviewId]);

//   // used to get interview details by mockid/interviewid
//   const GetInterviewDetails = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(MockInterview)
//         .where(eq(MockInterview.mockId, params.interviewId));
//       console.log(result);

//       if (result.length > 0) {
//         setInterviewData(result[0]);
//       } else {
//         console.error("No interview data found for the given ID");
//       }
//     } catch (error) {
//       console.error("Error fetching interview details:", error);
//     }
//   };

//   return (
//     <div className="my-10 flex justify-center flex-col items-center">
//       <h2 className="font-bold text-2xl">Let's Get Started</h2>
//       <div className="">
//         {webcamEnabled ? (
//           <Webcam
//             onUserMedia={() => setWebcamEnabled(true)}
//             onUserMediaError={() => setWebcamEnabled(false)}
//             mirrored={true}
//             style={{
//               height: 300,
//               width: 300,
//             }}
//           />
//         ) : (
//           <>
//             <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
//             <Button onClick={() => setWebcamEnabled(true)}>
//               Enable Webcam and Microphone
//             </Button>
//           </>
//         )}
//       </div>

//       {interviewData ? ( // Check if interviewData is defined
//         <div className="flex flex-col my-5">
//           <h2 className="text-lg"><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
//         </div>
//       ) : (
//         <div>Loading interview data...</div>
//       )}
//     </div>
//   );
// }

// export default Interview;
