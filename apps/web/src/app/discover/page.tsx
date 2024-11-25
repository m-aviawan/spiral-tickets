'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useQuery } from '@tanstack/react-query'
import instance from '@/util/axiosInstance'
import Link from 'next/link'
import Image from 'next/image'
import authStore from '@/zustand/authStore'
import toast from 'react-hot-toast'

const DiscoverPage = () => {
  const events = authStore(state => state.eventsByCategories)
  const isVerified = authStore(state => state.isVerified)
  const setEvents = authStore(state => state.setEvents)
  const { 
    data: dataEvents, 
    isPending: isPendingEvents, 
    isError: isErrorEvents 
    } = useQuery({
    queryKey: ['getEvents'],
    queryFn: async() => {
      let res = await instance.get('/event')
      setEvents({ eventsByCategories: [...res.data.data.eventsByCategories] })
      return res.data.data
    }
  })

  if(isPendingEvents) {
    return (
      <main className='fixed top-0 flex flex-col gap-1 h-screen w-full items-center justify-center'>
        <span className="loading loading-bars loading-lg"></span>
      </main>
    )
  }
  if(isErrorEvents) {
    return (
      <main>
        <section className='fixed top-0 gap-1 flex flex-col justify-center items-center h-screen w-full'>
          <h1 className='text-3xl font-bold'>Getting data failed!</h1>
          <p className='text-base font-light'>Please refresh page</p>
        </section>
      </main>
    )
  }


  return (
    <main className='flex flex-col gap-10 pl-72 overflow-hidden'>
      <aside className='overflow-auto fixed p-6 left-0 w-[280px] top-[66px] bg-white border-r border-r-gray-300 h-full'>
        <nav className='flex flex-col pb-20 gap-6'>
          <section className='flex justify-between pl-4 text-[15px] font-medium items-center'>
            <Label htmlFor="airplane-mode">Offline Event Only</Label>
            <Switch id="airplane-mode" />
          </section>
          <div className="collapse collapse-arrow rounded-none border-b border-b-gray-300">
            <input type="checkbox" name="my-accordion-2" defaultChecked/>
            <div className="collapse-title font-medium text-[15px]">Location</div>
            <div className="collapse-content text-sm text-gray-700">
              <ul className='flex flex-col'>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Jakarta</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Tangerang</li>
              </ul>
            </div>
          </div>
          <div className="collapse collapse-arrow rounded-none">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-medium text-[15px]">Event Type</div>
            <div className="collapse-content text-sm text-gray-700">
              <ul className='flex flex-col'>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Online</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Offline</li>
              </ul>
            </div>
          </div>
          <div className="collapse collapse-arrow rounded-none border-b border-b-gray-300">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-medium text-[15px]">Category</div>
            <div className="collapse-content text-sm text-gray-700">
              <ul className='flex flex-col'>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Education</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Playground</li>
              </ul>
            </div>
          </div>
          <div className="collapse collapse-arrow rounded-none">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-medium text-[15px]">Date Time</div>
            <div className="collapse-content text-sm text-gray-700">
              <ul className='flex flex-col'>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Today</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Tomorrow</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Weekend</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">This Week</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Next Week</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">This Month</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Next Month</li>
              </ul>
            </div>
          </div>
          <div className="collapse collapse-arrow rounded-none">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-medium text-[15px]">Price</div>
            <div className="collapse-content text-sm text-gray-700">
              <ul className='flex flex-col'>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Free</li>
                <li className="hover:shadow-lg hover:border hover:border-gray-100 rounded-md px-5 py-3 cursor-pointer">Paid</li>
              </ul>
            </div>
          </div>
        </nav>
      </aside>
      <section className='flex flex-col gap-5 overflow-hidden'>
        {
        events?.map((item: any) => {
          
          return (
            <section className="flex flex-col gap-5 overflow-x-auto">
              <h1 className="text-lg font-semibold">{item?.name}</h1>
              <section className="flex gap-3 w-fit">
                {item?.events?.map((itm: any) => {
              const startDate = new Date(itm.startDate).toDateString().split(' ');
              const [dayStart, monthStart, dateStart, yearStart] = startDate;
              const fixedStartDate = `${dateStart} ${monthStart} ${yearStart}`;
              const endDate = new Date(itm.endDate).toDateString().split(' ');
              const [dayEnd, monthEnd, dateEnd, yearEnd] = endDate;
              const fixedEndDate = `${dateEnd} ${monthEnd} ${yearEnd}`;
                  return (
                    <Link href={isVerified ? `/events/${btoa(itm.id)}` : '/discover'} onClick={() => !isVerified && toast.error('Please complete registration with verify email!')}>
                      <section className="hover:-translate-y-3 transition-[1s] flex flex-col items-start bg-white rounded-2xl overflow-hidden shadow-lg w-[250px]">
                        <figure className="h-[150px] bg-gray-300 w-full">
                          <Image 
                          src={itm.images[0].url}
                          width={300}
                          height={300}
                          alt=''
                          className='object-cover w-full h-full'
                          />
                        </figure>
                        <section className="flex flex-col p-5 text-sm gap-2 w-full">
                          <article className="flex flex-col gap-2">
                            <h1 className="font-bold">{itm?.name.toString().length <= 20 ? itm?.name : itm?.name.slice(0,20) + '...'}</h1>
                            <p className="text-gray-600">
                              {fixedEndDate === fixedStartDate
                                ? fixedStartDate
                                : `${fixedStartDate} - ${fixedEndDate}`}
                            </p>
                            <p className="text-gray-600">{itm?.locationName.toString().length <= 20 ? itm?.locationName : itm?.locationName.slice(0,20) + '...'}</p>
                            <p className="text-gray-600">{itm?.location === undefined || itm?.location === '' ? 'Online' : itm?.location.toString().length <= 20 ? itm?.location : itm?.location.slice(0,20) + '...'}</p>
                            <p className="font-bold">
                              {itm.isPaid ? 'Paid' : 'Free'}
                            </p>
                          </article>
                          <section className="flex gap-3 items-center border-t justify-end border-t-gray-300 pt-3 w-full">
                            <h1>{itm.eventOrganizer.companyName}</h1>
                            <figure className="rounded-full h-10 w-10 bg-gray-200 overflow-hidden">
                                {
                                  itm.eventOrganizer.profilePictureUrl && (
                                    <Image 
                                    src={itm.eventOrganizer.profilePictureUrl}
                                    width={100}
                                    height={100}
                                    alt=''
                                    />
                                  )
                                }
                            </figure>
                          </section>
                        </section>
                      </section>
                    </Link>
                  );
                })}
              </section>
            </section>
          );
        })
      }
      </section>
      
    </main>

  )
}

export default DiscoverPage
