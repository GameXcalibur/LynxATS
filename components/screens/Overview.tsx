"use client"
import React, {useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import {PiCaretLeftBold} from 'react-icons/pi'
import {PiCaretRightBold} from 'react-icons/pi'
import { register } from 'swiper/element/bundle';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Summary from '../cards/Summary'
import JobRoleCard from '../cards/JobRoleCard';
import DailyTaskCard from '../cards/DailyTaskCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { getAllApplicant, getAllApplicantComment, getAllPostedJobs, getAllScheduledInterviews } from '@/backend/actions/job.actions';

register()
const Overview =  () => {
  const router = useRouter()





  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [allJobs, setAllJobs] =  React.useState<any>([])





  const [allApplicant,setAllApplicant] = useState<any>()
  const [totalComment,setTotalComment] = useState<any>()
  const [tasks,setTasks] = useState<any>()
  const [tasklength,setTaskLength] = useState<any>()
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    let cancelled = false;

    const fetchAllData = async () => {
      try {
        const [applicantComments, scheduledInterviews, jobs] = await Promise.all([
          getAllApplicantComment().catch(() => []),
          getAllScheduledInterviews().catch(() => []),
          getAllPostedJobs().catch(() => []),
        ]);

        if (cancelled) return;

        setAllApplicant(applicantComments);

        setTasks(scheduledInterviews || []);
        setTaskLength(scheduledInterviews?.length || 0);

        const jobsData = jobs || [];
        setAllJobs(jobsData);

        const totalComments = jobsData.reduce((accJobs:any, job:any) => {
          const jobComments = job?.applications?.reduce((accApplications:any, application:any) => {
            return accApplications + (application?.noteAndFeedBack?.length || 0);
          }, 0);
          return accJobs + (jobComments || 0);
        }, 0);
        setTotalComment(totalComments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllData();

    return () => { cancelled = true; };
  },[])



  const handleSeeAllClick = ()=>{
    router.push('/jobs/all')
  }
  const handleRouteToTask = ()=>{
    router.push('/tasks')
  }

  // const frameworks = [
  //    //note that the value should start with small letter while the label should start with big letter
  //    allJobs.map((item:any)=>{
  //     return (
  //       {
  //         value: item?.jobTitle,
  //         label: item?.jobTitle
  //       }
  //     )
  //    })
  // ]

  // const frameworks = allJobs.map((item: any) => {
  //   return {
  //     value: item?.jobTitle,
  //     label: item?.jobTitle,
  //   };
  // });

  const frameworks = allJobs.map((item: any) => {
    return {
      value: item?.jobTitle.toLowerCase(),
      label: item?.jobTitle.charAt(0).toUpperCase() + item?.jobTitle.slice(1),
    };
  });



  const data = [
    {
      name: 'Page A',
      uv: 0,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 0,
      pv: 9000,
      amt: 9000, 
    },
    {
      name: 'Page C',
      uv: 0,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 0,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 4000,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 5000,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 6000,
      pv: 4300,
      amt: 2100,
    },
  ];
  
  

  return (
    <main className='flex flex-col items-center space-y-8'>
        <div className=' flex items-center justify-between w-full '>
          {/* <div className = " text-white flex items-center justify-center" ref={(node) => setPrevEl(node)}><PiCaretLeftBold size={45} className= "summaryNavButton"/></div> */}
                <Swiper
            // onSwiper={setSwiperRef}
            slidesPerView={3}
            // centeredSlides={true}
            // spaceBetween={0}
            // pagination={{
            // type: 'fraction',
            // }}
            // navigation={true}
            navigation={{ prevEl, nextEl }}
            modules={[Pagination, Navigation]}
            className='mySwiper summaryMainContainer w-[75vw] flex flex-row items-center justify-center gap-[41px]  '
            >
            
            <SwiperSlide><div><Summary key={1} data={data} summaryHeader='Posted Jobs' summaryTotal={allJobs?.length}/></div></SwiperSlide>
            <SwiperSlide><div><Summary key={2} data={data} summaryHeader='Applicants' summaryTotal={allApplicant?.length} /></div></SwiperSlide>
            <SwiperSlide><div><Summary key={4} data={data}summaryHeader='Employed' summaryTotal={23} /></div></SwiperSlide>
            {/* <SwiperSlide><div><Summary key={3} data={data}summaryHeader='Team' summaryTotal={10} /></div></SwiperSlide> */}
            </Swiper>

            {/* <div className = " text-white flex items-center justify-center" ref={(node) => setNextEl(node)}><PiCaretRightBold size={45} className= "summaryNavButton"/></div>        */}
        </div>
        <div className='flex gap-8 w-full '>
            <section className='w-2/5'>
                  <header className='activeJobsHeader flex flex-row items-center justify-between w-full rounded-[4px] '>
                    <div className='flex flex-row items-center justify-between w-full pl-2'>
                      <div>
                        <h1 className='text-black font-[400] text-[20px]'>Active Jobs({`${90}`})</h1>
                      </div>
                      <div>
                      <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] flex items-center justify-between activeJobsButton font-[400] text-[20px]"
                            >
                              {value
                                ? frameworks?.find((framework:any) => framework?.value === value)?.label
                                : "Select Job Role"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Job Role..." />
                              <CommandEmpty>No Job Role found.</CommandEmpty>
                              <CommandGroup>
                                {frameworks.map((framework:any) => (
                                  <CommandItem
                                    key={framework.value}
                                    value={framework?.value}
                                    onSelect={(currentValue) => {
                                      setValue(currentValue === value ? "" : currentValue)
                                      setOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {framework.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        </div>
                    </div>
                  </header>
                  <div onClick={handleSeeAllClick} className='jobRoleBackground flex flex-col justify-center gap-4 p-2'>
                    {allJobs?.slice(0,3).map( (item:any)=>{
                      return (
                        <JobRoleCard 
                        key = {item?._id}
                        jobtitle ={item?.jobTitle}
                        jobtype ={item?.jobType}
                        employmentstatus ={item?.employmentStatus}
                        jobdescription ={item?.jobDescription}
                        applications={item?.applications}
                        jobauthor={item?.author?.name}
                        />
                      )
                    })}
                    <div className='w-full flex justify-end items-end '>
                        <button onClick={handleSeeAllClick} className='seeAllBtnColor flex items-end  text-[16px] font-[400]'>See All</button>
                        <span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.08002" stroke="#3637EE" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                    </div>
                  </div>
            </section>

            <div className='flex flex-col w-3/5 space-y-8'>
           
              <section onClick={handleRouteToTask} className='w-full dailyTaskBackgroundColor p-2 flex flex-col gap-2'>
                <div className='flex items-center space-x-1'>
                  <svg width="5" height="25" viewBox="0 0 5 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="5" height="25" rx="2.5" fill="#69A959"/>
                  </svg>
                  <div className='flex items-center justify-center text-[22px] font-[400]'>
                  Daily Tasks

                  </div>
                  <div className='dailyTaskTagBackgroundColor flex items-center justify-center text-white h-[19px] w-[22px] rounded-[2px] text-[14px] font-[400]'>
                    {tasklength}
                  </div>

                </div> 
                {tasks?.slice(0,2).map((task:any)=>{
                  return (
                    <DailyTaskCard 
                    applicantImg={task?.applicant?.passport}
                    taskStartTime = {task?.scheduledDate}
                    taskEndTime = {task?.interviewEndTime}
                    applicantName = {task?.applicant?.name}
                    applicantJob = {task?.job?.jobTitle}
                    jobTitle = {task?.job?.jobTitle}
                    jobType = {task?.job?.jobType}
                    employmentStatus = {task?.job?.employmentStatus}
                    inviteLink = {task?.inviteLink}
                    interviewer = {task?.interviewer?.name}
                    />
                  )
                })}
                
              </section> 
       

              <section className='bg-white p-2 flex flex-col space-y-5 '>
                <div className='flex items-center space-x-1'>
                    <svg width="5" height="25" viewBox="0 0 5 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="5" height="25" rx="2.5" fill="#69A959"/>
                    </svg>
                    <div className='flex items-center justify-center text-[22px] font-[400]'>
                    Comments

                    </div>
                    <div className='dailyTaskTagBackgroundColor flex items-center justify-center text-white h-[19px] w-[22px] rounded-[2px] text-[14px] font-[400]'>
                    {/* {totalComment} */}{totalComment}
                    </div>

                  </div> 

                  <div className='flex flex-col gap-2'>
                    {allJobs?.slice(0,2).map((job:any) =>
                      job?.applications?.slice().reverse().map((applications:any) =>
                        applications?.noteAndFeedBack?.slice().reverse().map((nf:any, idx:number) => (
                          <div key={`${applications?._id}-${idx}`} className='flex items-start justify-start gap-[6px] my-2'>
                            <div>
                              <img className='h-[30px] w-[30px] rounded-full' alt='profile-img' src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'/>
                            </div>
                            <div className='flex flex-col w-full'>
                              <div className='text-[14px] text-left font-[400]'>{nf?.sender?.name}</div>
                              <div className='text-[12px] font-[400] text-left'>{nf?.sender?.email}</div>
                              <div className='messageBackground p-1 text-[14px] font-[400] my-2'>{nf?.content}</div>
                              <div>
                                <Link href={`jobs/${job?._id}/candidates/information/${applications?._id}`}><span className='text-blue-800'>@{nf?.receiver?.name}</span></Link>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
              </section>

            </div>
        </div>
    </main> 
  )
}


export default Overview



{/* <Swiper
onSwiper={setSwiperRef}
slidesPerView={3}
centeredSlides={true}
spaceBetween={30}
pagination={{
  type: 'fraction',
}}
navigation={true}
modules={[Pagination, Navigation]}
className='mySwiper summaryMainContainer flex flex-row gap-[41px] '
>
<SwiperSlide> <div><Summary/></div></SwiperSlide>
<SwiperSlide> <div><Summary/></div></SwiperSlide>
<SwiperSlide> <div><Summary/></div></SwiperSlide>
<SwiperSlide> <div><Summary/></div></SwiperSlide>
</Swiper> */}