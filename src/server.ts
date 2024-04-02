import fastify from "fastify";
import { z } from 'zod';
import { prisma } from "./lib/prisma";
import { TilingPattern } from "jspdf";
import { generateSlug } from "./utils/generation-slug";

const app = fastify();

app.post('/events', async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximunAttendes: z.number().int().positive().nullable()
    });

    const { title, details, maximunAttendes } = createEventSchema.parse(request.body);

    const slug = generateSlug(title);

    const evetnWithSameSlug = await prisma.event.findUnique({
        where: {
            slug: slug
        }
    })

    if(evetnWithSameSlug){
        throw new Error("Event already exists")
    }

    const event = await prisma.event.create({
        data: {
            title: title,
            details: details,
            maximunAttendes: maximunAttendes,
            slug
        }
    })

    return reply.status(201).send(event);
})

app.listen({ port: 3333 }).then(() => {
    console.log("server is running")
})