import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request) {
    try {
        const data = await request.json();
        const country = await prisma.country.findUnique({
            where: {
                id: data.countryId,
            },
        });

        return new Response(JSON.stringify(country), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);

        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        await prisma.$disconnect();
    }
  
}