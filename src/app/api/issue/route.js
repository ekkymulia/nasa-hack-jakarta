import { v4 as uuidv4 } from 'uuid'; 
import { PrismaClient } from '@prisma/client'
import { countryOverview, issuemaker } from '@/ai/issueMaker';

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request) {
    try {
        // Parse the request body as JSON
        const data = await request.json();

        const { countryName } = data;

        const co = await countryOverview(countryName);
        const country_issue = await issuemaker(co, []);
        
        // Return the created room as a response
        return new Response(country_issue, {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('Error generating issue:', error);

        // Return an error response with a generic error message
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        // Ensure the Prisma client is disconnected
        await prisma.$disconnect();
    }
}
