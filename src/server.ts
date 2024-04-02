import fastify from "fastify";
import { serializerCompiler, ZodTypeProvider, validatorCompiler } from 'fastify-type-provider-zod'
import { Schema, z } from 'zod';
import { prisma } from "./lib/prisma";
import { TilingPattern } from "jspdf";
import { generateSlug } from "./utils/generation-slug";

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app
.withTypeProvider<ZodTypeProvider>()
.post('/events', {
    schema: {
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

    return reply.status(201).send({ eventId: event.id });
})

app.listen({ port: 3333 }).then(() => {
    console.log("server is running")
})