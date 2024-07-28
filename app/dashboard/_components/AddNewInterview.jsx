// "use client";

// import React, { useState } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { LoaderCircle } from "lucide-react";
// import { MockInterview } from "@/utils/schema";
// import { db } from "@/utils/db";
// import { v4 as uuidv4 } from "uuid";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment/moment";

// function AddNewInterview() {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [jobPosition, setJobPosition] = useState();
//   const [jobDesc, setJobDesc] = useState();
//   const [jobExperience, setJobExperience] = useState();
//   const [loading, setLoading] = useState(false);
//   const [jsonResponse, setJsonResponse] = useState([]);
//   const { user } = useUser;
//   //   const onSubmit = async (e) => {
//   //     setLoading(true);

//   //     e.preventDefault();
//   //     console.log(jobPosition, jobDesc, jobExperience);

//   //     const InputPrompt =
//   //       "Job Position: " +
//   //       jobPosition +
//   //       ", Job Description: " +
//   //       jobDesc +
//   //       ", Years of Experience: " +
//   //       jobExperience +
//   //       ". Depends on this information please give me " +
//   //       process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
//   //       " Interview question with answeres in Json format. Give question and answers as field in JSON.";

//   //     const result = await chatSession.sendMessage(InputPrompt);
//   //     const MockJsonResp = result.response
//   //       .text()
//   //       .replace("```json", "")
//   //       .replace("```", "");
//   //     console.log(JSON.parse(MockJsonResp));

//   //     setLoading(false);
//   //   };

//   const onSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();

//     console.log(jobPosition, jobDesc, jobExperience);

//     const InputPrompt =
//       "Job Position: " +
//       jobPosition +
//       ", Job Description: " +
//       jobDesc +
//       ", Years of Experience: " +
//       jobExperience +
//       ". Depends on this information please give me " +
//       process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
//       " Interview question with answers in JSON format. Give question and answers as fields in JSON.";

//     try {
//       const result = await chatSession.sendMessage(InputPrompt);
//       let MockJsonResp = await result.response.text();

//       console.log("Raw response:", MockJsonResp);

//       // Clean up the response
//       MockJsonResp = MockJsonResp.replace(/```json/, "")
//         .replace(/```/, "")
//         .trim();

//       // Further clean-up to remove any unexpected non-JSON characters
//       MockJsonResp = MockJsonResp.replace(/[^\x20-\x7E]/g, "");

//       console.log("Cleaned response:", MockJsonResp);

//       // Attempt to parse the JSON response
//       let parsedResponse;
//       try {
//         parsedResponse = JSON.parse(MockJsonResp);
//       } catch (parseError) {
//         console.error("Error parsing JSON response:", parseError.message);
//         console.error("Response received after cleaning:", MockJsonResp);

//         // Debugging: Log the problematic part of the response
//         const problematicPart = MockJsonResp.slice(parseError.position - 10, parseError.position + 10);
//         console.error("Problematic part of the response:", problematicPart);

//         throw parseError;
//       }

//       console.log(parsedResponse);

//       setJsonResponse(parsedResponse); // Store parsed response instead of raw string

//       if (parsedResponse) {
//         const resp = await db
//           .insert(MockInterview)
//           .values({
//             mockId: uuidv4(),
//             jsonMockResp: JSON.stringify(parsedResponse), // Ensure this is a string
//             jobPosition: jobPosition,
//             jobDesc: jobDesc,
//             jobExperience: jobExperience,
//             createdBy: user?.primaryEmailAddress?.emailAddress,
//             createdAt: moment().format("DD-MM-YYYY"),
//           })
//           .returning({ mockId: MockInterview.mockId });

//         console.log("Inserted ID:", resp);

//         if (resp) {
//           setOpenDialog(false);
//         }
//       } else {
//         console.log("Error");
//       }
//     } catch (error) {
//       console.error("Error during submission:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div>
//       <div
//         className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all mt-4"
//         onClick={() => setOpenDialog(true)}
//       >
//         <h2 className="font-bold text-lg text-center">+ Add New</h2>
//       </div>
//       <Dialog open={openDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               Tell us more about your job interview
//             </DialogTitle>
//             <DialogDescription>
//               <form onSubmit={onSubmit}>
//                 <div>
//                   <h2>
//                     Add details about your Job Position/Role, Job Description
//                     and Years of Experience
//                   </h2>
//                   <div className="mt-7 my-2">
//                     <label className="text-black font-semibold">
//                       Job Role/Job Position
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. Full Stack Developer, Data Engineer"
//                       required
//                       onChange={(event) => setJobPosition(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Job Description/ Tech Stack
//                     </label>
//                     <Textarea
//                       className="mt-2"
//                       placeholder="Ex. ReactJs, NextJs, MySQL, Java, C#"
//                       required
//                       onChange={(event) => setJobDesc(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Years of Experience
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. 0, 2"
//                       type="number"
//                       required
//                       max="50"
//                       onChange={(event) => setJobExperience(event.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="gap-5 flex justify-end">
//                   <Button type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <LoaderCircle className="animate-spin" />
//                         Generating from AI
//                       </>
//                     ) : (
//                       "Start Interview"
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => setOpenDialog(false)}
//                     className="border border-red-700"
//                   >
//                     <span className="text-red-700">Cancel</span>
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default AddNewInterview;

// YE ASLI CODE HAI 

// "use client";

// import React, { useState } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { LoaderCircle } from "lucide-react";
// import { MockInterview } from "@/utils/schema";
// import { db } from "@/utils/db";
// import { v4 as uuidv4 } from "uuid";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment/moment";
// import { useRouter } from "next/navigation";

// function AddNewInterview() {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [jobPosition, setJobPosition] = useState("");
//   const [jobDesc, setJobDesc] = useState("");
//   const [jobExperience, setJobExperience] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [jsonResponse, setJsonResponse] = useState([]);
//   const { user } = useUser(); // Corrected useUser usage
//   const router = useRouter();
  

//   const onSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();

//     console.log(jobPosition, jobDesc, jobExperience);

//     const InputPrompt =
//       "Job Position: " +
//       jobPosition +
//       ", Job Description: " +
//       jobDesc +
//       ", Years of Experience: " +
//       jobExperience +
//       ". Depends on this information please give me " +
//       process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
//       " Interview question with answers in JSON format. Give question and answers as fields in JSON.";

//     try {
//       const result = await chatSession.sendMessage(InputPrompt);
//       let MockJsonResp = await result.response.text();

//       // Clean up the response
//       MockJsonResp = MockJsonResp.replace(/```json/, "")
//         .replace(/```/, "")
//         .trim();

//       // Parse the JSON response
//       const parsedResponse = JSON.parse(MockJsonResp);
//       console.log(parsedResponse);

//       setJsonResponse(parsedResponse); // Store parsed response instead of raw string

//       if (parsedResponse) {
//         const resp = await db
//           .insert(MockInterview)
//           .values({
//             mockId: uuidv4(),
//             jsonMockResp: JSON.stringify(parsedResponse), // Ensure this is a string
//             jobPosition: jobPosition,
//             jobDesc: jobDesc,
//             jobExperience: jobExperience,
//             createdBy: user?.primaryEmailAddress?.emailAddress,
//             createdAt: moment().format("DD-MM-YYYY"),
//           })
//           .returning({ mockId: MockInterview.mockId });

//         console.log("Inserted ID:", resp);
//         if(resp){
//           setOpenDialog(false);
//           router.push('/dashboard/interview/'+resp[0]?.mockId);
//         }
//       } else {
//         console.log("Error");
//       }
//     } catch (error) {
//       console.error("Error parsing JSON response:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div
//         className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all mt-4"
//         onClick={() => setOpenDialog(true)}
//       >
//         <h2 className="font-bold text-lg text-center">+ Add New</h2>
//       </div>
//       <Dialog open={openDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               Tell us more about your job interview
//             </DialogTitle>
//             <DialogDescription>
//               <form onSubmit={onSubmit}>
//                 <div>
//                   <h2>
//                     Add details about your Job Position/Role, Job Description
//                     and Years of Experience
//                   </h2>
//                   <div className="mt-7 my-2">
//                     <label className="text-black font-semibold">
//                       Job Role/Job Position
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. Full Stack Developer, Data Engineer"
//                       required
//                       value={jobPosition}
//                       onChange={(event) => setJobPosition(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Job Description/ Tech Stack
//                     </label>
//                     <Textarea
//                       className="mt-2"
//                       placeholder="Ex. ReactJs, NextJs, MySQL, Java, C#"
//                       required
//                       value={jobDesc}
//                       onChange={(event) => setJobDesc(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Years of Experience
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. 0, 2"
//                       type="number"
//                       required
//                       max="50"
//                       value={jobExperience}
//                       onChange={(event) => setJobExperience(event.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="gap-5 flex justify-end">
//                   <Button type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <LoaderCircle className="animate-spin" />
//                         Generating from AI
//                       </>
//                     ) : (
//                       "Start Interview"
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => setOpenDialog(false)}
//                     className="border border-red-700"
//                   >
//                     <span className="text-red-700">Cancel</span>
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default AddNewInterview;

// youtuber ka code
"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExperience,setJobExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [jsonResponse,setJsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();
    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt="Job position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience : "+jobExperience+" , Depends on Job Position, Job Description & Years of Experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" Interview question along with Answer in JSON format, Give us question and answer field on JSON"

        const result=await chatSession.sendMessage(InputPrompt);
        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);

        if(MockJsonResp)
        {
        const resp=await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId});

        console.log("Inserted ID:",resp)
        if(resp)
        {
            setOpenDailog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else{
        console.log("ERROR");
    }
        setLoading(false);
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer
         transition-all border-dashed'
         onClick={()=>setOpenDailog(true)}
         >
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
       
        <DialogContent className="max-w-2xl">
            <DialogHeader >
            <DialogTitle className="text-2xl" >Tell us more about your job interviwing</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>
                   
                    <h2>Add Details about yout job position/role, Job description and years of experience</h2>

                    <div className='mt-7 my-3'>
                        <label>Job Role/Job Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required
                        onChange={(event)=>setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className=' my-3'>
                        <label>Job Description/ Tech Stack (In Short)</label>
                        <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" 
                        required
                        onChange={(event)=>setJobDesc(event.target.value)} />
                    </div>
                    <div className=' my-3'>
                        <label>Years of experience</label>
                        <Input placeholder="Ex.5"  type="number"  max="100" 
                        required
                        onChange={(event)=>setJobExperience(event.target.value)}
                        />
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} >
                        {loading? 
                        <>
                        <LoaderCircle className='animate-spin' /> Generating from AI
                        </>:'Start Interview'    
                    }
                        </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview


// "use client";

// import React, { useState } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { LoaderCircle } from "lucide-react";
// import { MockInterview } from "@/utils/schema";
// import { db } from "@/utils/db";
// import { v4 as uuidv4 } from "uuid";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment/moment";

// function AddNewInterview() {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [jobPosition, setJobPosition] = useState("");
//   const [jobDesc, setJobDesc] = useState("");
//   const [jobExperience, setJobExperience] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [jsonResponse, setJsonResponse] = useState([]);
//   const { user } = useUser(); // Corrected useUser usage

//   const onSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();

//     console.log(jobPosition, jobDesc, jobExperience);

//     const InputPrompt =
//       "Job Position: " +
//       jobPosition +
//       ", Job Description: " +
//       jobDesc +
//       ", Years of Experience: " +
//       jobExperience +
//       ". Depends on this information please give me " +
//       process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
//       " Interview question with answers in JSON format. Give question and answers as fields in JSON.";

//     try {
//       const result = await chatSession.sendMessage(InputPrompt);
//       let MockJsonResp = await result.response.text();

//       console.log("Raw response:", MockJsonResp);

//       // Clean up the response
//       MockJsonResp = MockJsonResp.replace(/```json/, "")
//         .replace(/```/, "")
//         .trim();

//       // Further clean-up to remove any unexpected non-JSON characters
//       MockJsonResp = MockJsonResp.replace(/[^\x20-\x7E]/g, "");

//       console.log("Cleaned response:", MockJsonResp);

//       // Attempt to parse the JSON response
//       let parsedResponse;
//       try {
//         parsedResponse = JSON.parse(MockJsonResp);
//       } catch (parseError) {
//         console.error("Error parsing JSON response:", parseError.message);
//         console.error("Response received after cleaning:", MockJsonResp);

//         // Debugging: Log the problematic part of the response
//         const problematicPart = MockJsonResp.slice(parseError.position - 10, parseError.position + 10);
//         console.error("Problematic part of the response:", problematicPart);

//         throw parseError;
//       }

//       console.log(parsedResponse);

//       setJsonResponse(parsedResponse); // Store parsed response instead of raw string

//       if (parsedResponse) {
//         const resp = await db
//           .insert(MockInterview)
//           .values({
//             mockId: uuidv4(),
//             jsonMockResp: JSON.stringify(parsedResponse), // Ensure this is a string
//             jobPosition: jobPosition,
//             jobDesc: jobDesc,
//             jobExperience: jobExperience,
//             createdBy: user?.primaryEmailAddress?.emailAddress,
//             createdAt: moment().format("DD-MM-YYYY"),
//           })
//           .returning({ mockId: MockInterview.mockId });

//         console.log("Inserted ID:", resp);
//       } else {
//         console.log("Error");
//       }
//     } catch (error) {
//       console.error("Error during submission:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div
//         className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all mt-4"
//         onClick={() => setOpenDialog(true)}
//       >
//         <h2 className="font-bold text-lg text-center">+ Add New</h2>
//       </div>
//       <Dialog open={openDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               Tell us more about your job interview
//             </DialogTitle>
//             <DialogDescription>
//               <form onSubmit={onSubmit}>
//                 <div>
//                   <h2>
//                     Add details about your Job Position/Role, Job Description
//                     and Years of Experience
//                   </h2>
//                   <div className="mt-7 my-2">
//                     <label className="text-black font-semibold">
//                       Job Role/Job Position
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. Full Stack Developer, Data Engineer"
//                       required
//                       value={jobPosition}
//                       onChange={(event) => setJobPosition(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Job Description/ Tech Stack
//                     </label>
//                     <Textarea
//                       className="mt-2"
//                       placeholder="Ex. ReactJs, NextJs, MySQL, Java, C#"
//                       required
//                       value={jobDesc}
//                       onChange={(event) => setJobDesc(event.target.value)}
//                     />
//                   </div>
//                   <div className="my-3">
//                     <label className="text-black font-semibold">
//                       Years of Experience
//                     </label>
//                     <Input
//                       className="mt-2"
//                       placeholder="Ex. 0, 2"
//                       type="number"
//                       required
//                       max="50"
//                       value={jobExperience}
//                       onChange={(event) => setJobExperience(event.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="gap-5 flex justify-end">
//                   <Button type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <LoaderCircle className="animate-spin" />
//                         Generating from AI
//                       </>
//                     ) : (
//                       "Start Interview"
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => setOpenDialog(false)}
//                     className="border border-red-700"
//                   >
//                     <span className="text-red-700">Cancel</span>
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default AddNewInterview;
