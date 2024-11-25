'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { Sidebar } from 'lucide-react'
import { SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent } from '@/components/ui/sidebar'
import { Plus } from 'lucide-react'
import { MdOutlineEventNote } from "react-icons/md";
import { MdHomeFilled } from "react-icons/md";
import { MdContacts } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdDocumentScanner } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaRegCalendarAlt } from 'react-icons/fa'
import { MdApps } from "react-icons/md";
import Link from 'next/link'
import { IoCloseSharp } from "react-icons/io5";
import { usePathname } from 'next/navigation'
import authStore from '@/zustand/authStore'
import { useRouter } from 'next/navigation'

interface IMemberPageLayoutProps {
  children: ReactNode
}


const MemberPageLayout = ({children}: IMemberPageLayoutProps) => {
  const [ isMenuActive, setIsMenuActive ] = useState(false)
  const role = authStore(state => state.role)
  const router = useRouter()
  const dashboardMenuListForEO = [
    {
      title: 'Dashboard',
      icon: <MdHomeFilled className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/dashboard'
    },
    {
      title: 'Events List',
      icon: <MdOutlineEventNote className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/events'
    },
    {
      title: 'Create Event',
      icon: <FaRegCalendarAlt className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/events/create'
    }
  ]

  const myAccountMenuListForEO = [
    {
      title: 'Information',
      icon: <MdContacts className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/profile/information'
    },
    {
      title: 'Settings',
      icon: <MdOutlineSettings className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/profile/settings'
    },
    {
      title: 'Legal Information',
      icon: <MdDocumentScanner className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/profile/legal-information'
    },
    {
      title: 'Bank Accounts',
      icon: <FaMoneyCheckAlt className="text-black h-4 w-4"/>,
      href: '/event-organizer/member/profile/bank-accounts'
    },
  ]

  const activateNav = () => {
    setIsMenuActive(!isMenuActive)
  }
  if(role !== "EO") router.push('/')
  return (
    <main>
      <button onClick={() => activateNav()} className='xl:hidden z-50 fixed top-12 md:top-16 p-2 left-0 bg-white border-b border-b-gray-300 text-sm w-full hover:bg-gray-300'>
        Navigation
      </button>
      {
        isMenuActive && (
            <nav className='xl:hidden bg-white border border-b-gray-300 z-50 fixed top-12 lg:top-16 w-full left-0'>
              <ul className='flex flex-col gap-1'>
                {
                  dashboardMenuListForEO.map((item, index) => {
                    return (
                              <Link key={index} href={item.href} onClick={() => setIsMenuActive(false)}>
                                <li className='text-sm font-semibold p-3 flex gap-8 transition-[0.25s] items-center hover:underline'>{item.icon}{item.title}</li>
                              </Link>
                            )
                          })
                        }
                        {
                          myAccountMenuListForEO.map((item, index) => {
                            return (
                              <Link key={index} href={item.href} onClick={() => setIsMenuActive(false)}>
                                <li className='text-sm font-semibold p-3 flex gap-8 transition-[0.25s] items-center hover:underline'>{item.icon}{item.title}</li>
                              </Link>
                            )
                          })
                        }
                      <li onClick={() => activateNav()} className='text-sm font-semibold p-3 flex gap-8 transition-[0.25s] items-center hover:underline hover:cursor-pointer'>
                        <IoCloseSharp className="text-black h-4 w-4"/>
                        Close Navigation
                      </li>
                    </ul>
            </nav>
        )
      }
      <aside className='hidden xl:flex flex-col bg-white shadow-lg fixed top-0 left-0 w-[300px] h-screen pt-20'>
        <section className='flex flex-col border-b border-b-gray-300'>
          <h1 className='text-xs font-bold p-3'>Dashboard</h1>
            {
              dashboardMenuListForEO.map((item, index) => {
                return (
                  <Link key={index} href={item.href}>
                    <div className='text-sm font-semibold p-3 flex gap-8 transition-[0.25s] items-center hover:bg-yellow-400'>{item.icon}{item.title}</div>
                  </Link>
                )
              })
            }
        </section>
        <section className='flex flex-col border-b border-b-gray-300'>
          <h1 className='text-xs font-bold p-3'>My Account</h1>
            {
              myAccountMenuListForEO.map((item, index) => {
                return (
                  <Link key={index} href={item.href}>
                    <div className='text-sm font-semibold p-3 flex gap-8 transition-[0.25s] items-center hover:bg-yellow-400'>{item.icon}{item.title}</div>
                  </Link>
                )
              })
            }
        </section>
      </aside>
      <section className='pt-4 md:pt-8 xl:pt-4 xl:pl-[300px]'>
        {children}
      </section>
    </main>
  )
}

export default MemberPageLayout