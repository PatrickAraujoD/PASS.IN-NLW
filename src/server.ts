import fastify from "fastify";
import { serializerCompiler, ZodTypeProvider, validatorCompiler } from 'fastify-type-provider-zod'
import { Schema, z } from 'zod';
import { prisma } from "./lib/prisma";
import { TilingPattern } from "jspdf";
import { generateSlug } from "./utils/generation-slug";
import { createEvent } from "./routes/create-event";

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)

app.listen({ port: 3333 }).then(() => {
    console.log("server is running")
})