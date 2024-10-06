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

        const { issue, choosen_solution, countryId } = data;

        const country = await prisma.country.findUnique({
            where: {
                id: data.countryId,
            },
        });

        const updatedCountry = await prisma.country.update({
            where: {
                id: countryId,
            },
            data: {
                countryModifier: {
                    ...(country.countryModifier || {}), // Spread existing data if any
                    issue: issue, // Add new issue
                    choosen_solution: choosen_solution, // Add chosen solution
                },
            },
        });


        // const co = await countryOverview(countryName);
        // const country_news = await newsmaker(co, []);

        // function removeFirstAndLastLine(text) {
        //     const lines = text.split('\n'); // Split the string into an array of lines
        //     if (lines.length <= 2) {
        //         return ''; // Return an empty string if there are less than 3 lines
        //     }
        //     return lines.slice(1, -1).join('\n'); // Remove the first and last lines, then join the remaining lines
        // }

        // const modifiedIssue = removeFirstAndLastLine(country_issue);
        
        // Return the created room as a response
        return new Response('ok', {
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
