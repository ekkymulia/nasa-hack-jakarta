import { v4 as uuidv4 } from 'uuid'; 
import { PrismaClient } from '@prisma/client'

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

        // Validate that a username is provided
        const { username } = data;
        if (!username) {
            return new Response(JSON.stringify({ error: 'Username is required' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // Generate a unique 4-letter room code
        const generated4LetterCode = uuidv4().split('-')[0].toUpperCase();

        // Create a new room with the generated code and include the participant's username
        const room = await prisma.room.create({
            data: {
                room_code: generated4LetterCode,
                participants: {
                    create: {
                        username, // Add the username directly here
                        participants_at: new Date().toISOString(), // Set the current date/time as participants_at
                        // Add any other necessary fields for RoomParticipants if needed
                    }
                }
            }
        });

        // Return the created room as a response
        return new Response(JSON.stringify(room), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('Error creating room:', error);

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
