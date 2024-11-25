import prisma from "@/connection"
import { cloudinaryUpload } from "@/utils/cloudinary"
import { addWeeks, isAfter, isBefore } from "date-fns"
import { NextFunction, Request, Response } from "express"
import { Multer } from "multer"
import { boolean } from "yup"

export const createEvent = async(req: Request, res: Response, next: NextFunction) => {
    const { 
        id, name, type, locationName,
        location, url = null, description = null, startDate,
        endDate, isPaid = true, categoryId, tickets
    } = req.body

    let files 
    const imagesUploaded: string[] = []
    if(req.files) {
        files = Array.isArray(req.files) ?
        req.files : req.files['images']

        for (let item of files) {
            const result: any = await cloudinaryUpload(item?.buffer)
            const res: string = result?.res!
            imagesUploaded.push(res)
        }
    }
    
    // const capacityArr: number[] = tickets.map((item: any) => item.available)
    // const capacity: number = capacityArr.reduce((acc: number, curr: number) => acc + curr)

    // const isDateValid = isAfter(new Date(startDate), new Date(endDate))

    // let newEvent;
    
    // if(isDateValid) {
        // newEvent = await prisma.event.create({
        //     data: { 
        //         eoId: id, 
        //         name, 
        //         type,
        //         location, 
        //         locationName, 
        //         url,
        //         description, 
        //         startDate, 
        //         endDate,
        //         isPaid, 
        //         categoryId, 
        //         capacity
        //     }
        // })
    // } else {
    //     throw { err: 'Start Date must before End Date!' }
    // }
    
        const createdImages = imagesUploaded?.map((item) => {
            console.log(item)
            return { 
                url: item,
                // eventId: newEvent?.id
             }
        })
    
        console.log(createdImages)
    // const addEventTicket = tickets.map((item: any) => {
    //     if(item.discount && item.discount != 0) {
    //         return {
    //             name: item.name,
    //             price: item.price,
    //             available: item.totalSeat,
    //             totalSeat: item.toalSeat,
    //             bookSeat: 0,
    //             discount: item.discount,
    //             discountStart: item.discountStart,
    //             discountExpiry: item.discountExpiry,
    //             startDate: item.startDate,
    //             endDate: item.endDate
    //         }
    //     }
    //     return {
    //         name: item.name,
    //         price: item.price,
    //         available: item.totalSeat,
    //         totalSeat: item.toalSeat,
    //         bookSeat: 0,
    //         startDate: item.startDate,
    //         endDate: item.endDate
    //     }
        
    // })

    // await prisma.eventTicket.createMany({
    //     data: addEventTicket
    // })

    // await prisma.eventImage.createMany({
    //     data: createdImages!
    // })
}

export const updateEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            id, name, type, locationName,
            location, url = null, description = null, startDate,
            endDate, isPaid = false, categoryId, tickets, capacity
        } = req.body
    
        const { eventId } = req.params
    
        const currentEventData = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })
    
        const limitStartDateChange = addWeeks(currentEventData!.startDate, 2)
        const isStartDateChangeValid = isBefore(limitStartDateChange, new Date(startDate))
        const isEndDateChangeValid = isAfter(currentEventData!.startDate, new Date(endDate))
    
        if(isStartDateChangeValid && isEndDateChangeValid) {
            await prisma.event.update({
                where: { id: eventId },
                data: {
                    description, startDate, 
                    endDate, location, 
                    locationName, capacity
                }
            })
        } else {
            throw { msg: 'Start Date or End Date invalid!', status: 406 }
        }
    } catch (error) {
        next(error)
    }

}

export const getEvents = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { event = '' } = req.query
        interface IFilterFeat {
            take: number,
            skip: number,
            name: string
        }

        let { take = 20, skip = 0, name = '' }: any = req.query
        let eventsByCategories, events;
        events = await prisma.event.findMany({
            take: 20,
            skip: 0,
            include: {
                images: true
            }
        })
        eventsByCategories = await prisma.category.findMany({
            // skip,
            // take,
            include: {
                events: {
                    where: {
                        name: {
                            startsWith: `${event}%`
                        }
                    },
                    include: {
                        images: true,
                        eventOrganizer: true
                    }
                }
            }
        })
        if(name?.length >= 3) {
            eventsByCategories = await prisma.event.findMany({
                where: { 
                    name: {
                        startsWith: '%',
                        endsWith: '%'
                    }
                },
                include: {
                    eventOrganizer: true,
                    images: true
                },
                skip,
                take
            })
        }
        
        res.status(200).json({
            error: false,
            message: 'Get events success',
            data: {
                events,
                eventsByCategories
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getEventDetail = async(req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params
    
    const eventDetail = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            tickets: true,
            images: true,
            reviews: true
        }
    })

    const getEventOrganizer = await prisma.eventOrganizer.findUnique({
        where: {
            id: eventDetail?.eoId
        }
    }) 
 
    const eventImagesPath: string[] | undefined = eventDetail?.images?.map((item) => {
        return item.url
    })

    let eventTickets: any[] | undefined = []
    eventDetail?.tickets.forEach((item) => {
        const isAfterStart = isAfter(new Date(item.startDate), new Date())
        const isBeforeEnd = isBefore(new Date(item.endDate), new Date())
        let availability = ''
        let available = item.available - item.bookSeat
        if(isAfterStart && isBeforeEnd) {
            availability = 'Sale'
            if(available <= 0) {
                availability = 'Sold out!'
            }
        } else if (!isAfterStart && isBeforeEnd) {
            availability = 'Coming soon'
        } else if (isAfterStart && !isBeforeEnd) {
            availability = 'Ended'
        } else {
            throw { msg: 'Ticket start date and end date invalid!', status: 500 }
        }

        let isDiscountStart, isDiscountEnd, discountStatus;
        if(item.discountStart && item.discountExpiry) {
            isDiscountStart = isAfter(new Date(item.discountStart), new Date())
            isDiscountEnd = isBefore(new Date(item.discountExpiry), new Date())
            discountStatus = Boolean(isDiscountEnd && isDiscountStart)
        }

        eventTickets.push({
            availability,
            name: item.name,
            price: item.price,
            available,
            discount: item.discount,
            discountStart: item.discountStart,
            discountExpiry: item.discountExpiry,
            discountStatus,
            startDate: item.startDate,
            endDate: item.endDate
        })
    })
    res.status(200).json({
        error: false,
        message: 'Get event detail success',
        data: {
            eventDetail,
            eventOrganizer: {
                companyName: getEventOrganizer?.companyName,
                address: getEventOrganizer?.address,
                email: getEventOrganizer?.email,
            },
            eventTickets,
            eventImagesPath
        }
    })
}