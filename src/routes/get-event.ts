import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId", {
        schema: {
            summary: 'Get events',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        details: z.string().nullable(),
                        maximumAttendees: z.number().nullable(), 
                        slug: z.string(),
                        attendeesAmount: z.number()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { eventId } = request.params

        const event = await prisma.event.findUnique({
            select: {
                id: true,
                title: true,
                slug: true,
                details: true,
                maximunAttendes: true,
                _count: {
                    select: {
                        attendes: true
                    }
                }
            },
            where: {
                id: eventId
            }
        })

        if(!event){
            throw new Error("Event not found")
        }

        return reply.send({
            event: {
                id: event.id,
                title: event.title,
                details: event.details,
                maximumAttendees: event.maximunAttendes,
                slug: event.slug,
                attendeesAmount: event._count.attendes,
            }
        })
    })
}