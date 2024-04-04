import { prisma } from "../src/lib/prisma"

async function seed(){
    await prisma.event.create({
        data: {
            id: 'c5e78c9c-9da0-4f4a-bd77-40584a2097ce',
            title: "Unite submit",
            slug: "unite-submit",
            details: "Um evento p/ devs apaixonados(as) por código",
            maximunAttendes: 120
        }
    })
}

seed().then(() => {
    console.log("Database seeded")
    prisma.$disconnect()
})