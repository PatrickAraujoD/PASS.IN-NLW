import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generation-slug";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createEvent(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
        schema: {
            summary: 'Create events',
            tags: ['events'],
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximunAttendes: z.number().int().positive().nullable()
            }),
            response: {
                201: z.object({
                    eventId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {
        const { title, details, maximunAttendes } = request.body;
    
        const slug = generateSlug(title);
    
        const evetnWithSameSlug = await prisma.event.findUnique({
            where: {
                slug: slug
            }
        })
    
        if(evetnWithSameSlug){
            throw new BadRequest("Event already exists")
        }
    
        const event = await prisma.event.create({
            data: {
                title: title,
                details: details,
                maximunAttendes: maximunAttendes,
                slug
            }
        })
    
        return reply.status(201).send({ eventId: event.id });
    })
}
