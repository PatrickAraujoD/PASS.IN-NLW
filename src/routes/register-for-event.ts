import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance){
    app
     .withTypeProvider<ZodTypeProvider>()
     .post("/events/:eventId/attendees", {
        schema: {
            summary: 'Register for events',
            tags: ['attendee'],
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                201: z.object({
                    attendeeId: z.number()
                })
            }
        }
     }, async (request, reply) => {
        const { eventId } = request.params
        const { name, email } = request.body

        const attendeeFromEmail = await prisma.attende.findUnique({
            where: {
                eventId_email: {
                    email: email,
                    eventId: eventId
                }
            }
        })

        if(attendeeFromEmail) {
            throw new Error("This e-mail is already registered for this event")
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                },
            }),
            prisma.attende.count({
                where: {
                    eventId,
                }
            })
        ])
        
        if (event?.maximunAttendes && amountOfAttendeesForEvent >= event?.maximunAttendes){
            throw new Error("the maximun number of attendes of attendes for this event has been reached")
        }

        const attendee = await prisma.attende.create({
            data : {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({ attendeeId: attendee.id })
     })
}