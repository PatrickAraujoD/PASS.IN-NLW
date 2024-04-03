import fastify from "fastify";
import { serializerCompiler, ZodTypeProvider, validatorCompiler } from 'fastify-type-provider-zod'
import { Schema, z } from 'zod';
import { prisma } from "./lib/prisma";
import { TilingPattern } from "jspdf";
import { generateSlug } from "./utils/generation-slug";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)

app.listen({ port: 3333 }).then(() => {
    console.log("server is running")
})