import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
// import path from 'path';

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// // Load base country data from JSON file
// const loadBaseCountries = () => {
//     const filePath = path.join(__dirname, './baseCountry.json');
//     const fileData = fs.readFileSync(filePath, 'utf-8');
//     return JSON.parse(fileData);
// };

// // Adding country modifier to room participant
// export async function POST(request) {
//     try {
//         const data = await request.json(); // Expecting room code, username, and country data from request body

//         const { roomCode, username, countryName } = data;

//         // Validate the incoming data
//         if (!roomCode || !username || !countryName) {
//             return new Response(JSON.stringify({ error: 'Invalid input data' }), {
//                 status: 400,
//                 headers: corsHeaders,
//             });
//         }

//         // Load country data
//         const countries = loadBaseCountries();
//         const countryData = countries.find(country => country.countryName === countryName);

//         if (!countryData) {
//             return new Response(JSON.stringify({ error: 'Country not found' }), {
//                 status: 404,
//                 headers: corsHeaders,
//             });
//         }

//         // Find the participant in the room by roomCode and username
//         const participant = await prisma.roomParticipant.findUnique({
//             where: {
//                 roomCode_username: {
//                     roomCode,
//                     username,
//                 },
//             },
//         });
//         console.log('ads2')


//         if (!participant) {
//             return new Response(JSON.stringify({ error: 'Participant not found' }), {
//                 status: 404,
//                 headers: corsHeaders,
//             });
//         }

//         // Update the participant to include the country data
//         const updatedParticipant = await prisma.roomParticipant.update({
//             where: { id: participant.id },
//             data: {
//                 country: {
//                     create: {
//                         countryName: countryData.countryName,
//                         countryFlag: countryData.countryFlag,
//                         gdpValue: countryData.gdpValue,
//                         gdpGrowth: countryData.gdpGrowth,
//                         carbonEmission: countryData.carbonEmission,
//                         countryModifier: countryData.countryModifier,  // JSON structure
//                         newsReport: countryData.newsReport,             // JSON structure
//                     },
//                 },
//             },
//         });

//         return new Response(JSON.stringify(updatedParticipant), {
//             status: 200, // OK
//             headers: corsHeaders,
//         });
//     } catch (error) {
//         console.error(error);
        
//         return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//             status: 500,
//             headers: corsHeaders,
//         });
//     } finally {
//         await prisma.$disconnect();
//     }
// }
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