import fastify from "fastify";
import { z } from 'zod';
import { prisma } from "./lib/prisma";
import { TilingPattern } from "jspdf";

const app = fastify();

app.post('/events', async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximunAttendes: z.number().int().positive().nullable()
    });

    const { title, details, maximunAttendes } = createEventSchema.parse(request.body);

    const event = await prisma.event.create({
        data: {
            title: title,
            details: details,
            maximunAttendes: maximunAttendes,
            slug: new Date().toDateString()
        }
    })

    return reply.status(201).send(event);
})

app.listen({ port: 3333 }).then(() => {
    console.log("server is running")
})