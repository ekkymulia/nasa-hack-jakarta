import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises'; // Use fs/promises for async file reading
import path from 'path';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Function to load base countries asynchronously
const loadBaseCountries = async () => {
    const filePath = path.join(process.cwd(), 'src/app/api/issue/baseNasaData.json');
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading baseCountry.json:', error);
        throw new Error('Could not load country data');
    }
};

export const countryOverview = async (countryName) => {
    try {
        const countries = await loadBaseCountries(); // Load the countries from the JSON file
        const countryInfo = countries.find(
            country => country.countryName === countryName
        );
        console.log(countries, countryName, 'sdfsfs');
        
        if (countryInfo) {
        } else {
            console.log(`Country '${countryName}' not found.`);
        }
        

        if (countryInfo) {
            return countryInfo;
        } else {
            throw new Error(`Country '${countryName}' not found.`);
        }
    } catch (error) {
        console.error(`Error reading country data: ${error.message}`);
        throw error; 
    }
};

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 1,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Use JSON data below to identify issues that might happen in a country. Provide 5 issues in the response in the following JSON format: 
    [
            "issue": "issue1",
            "issue_story": "issue_story",
            "debate_solution": [
                    "solution": "solution",
                    "modifier_to_country": [
                            "protocol_item": "protocol_item",
                            "value_affected": "value_affected"
                    ]
            ]
    ]`],
    ["human", "Country Data: {country_data}. Addressed Issues Before: {addressed_issue}"],
]);

const runnableAgent = RunnableSequence.from([
    prompt,
    model,
]);

export const issuemaker = async (country_data, addressed_issue) => {
    try {
        const result = await runnableAgent.invoke({ country_data, addressed_issue });
        console.log(result.content); // Log the result content
        return result.content;
    } catch (error) {
        console.error(`Error generating issues: ${error.message}`);
        throw error;
    }
};

// Adding country modifier to room participant
export async function POST(request) {
    try {
        const data = await request.json(); // Expecting room code, username, and country data from request body
        const { roomId, username, countryName } = data;

        // Validate the incoming data
        if (!roomId || !username || !countryName) {
            return new Response(JSON.stringify({ error: 'Invalid input data' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // Load country data
        const countries = await loadBaseCountries();
        const countryData = countries.find(country => country.countryName === countryName);

        if (!countryData) {
            return new Response(JSON.stringify({ error: 'Country not found' }), {
                status: 404,
                headers: corsHeaders,
            });
        }

        // Find the participant by the roomId and username
        const participant = await prisma.roomParticipants.findMany({
            where: {
                roomId: roomId,
                username: username,
            },
        });

        if (!participant.length) {
            return new Response(JSON.stringify({ error: 'Participant not found' }), {
                status: 404,
                headers: corsHeaders,
            });
        }

        // Update the participant to include the country data
        const updatedParticipant = await prisma.roomParticipants.update({
            where: { id: participant[0].id }, // Ensure this is a valid ID
            data: {
                play_as: {
                    create: {
                        countryName: countryData.countryName,
                        countryFlag: countryData.countryFlag,
                        gdpValue: countryData.gdpValue,
                        gdpGrowth: countryData.gdpGrowth,
                        carbonEmission: countryData.carbonEmission,
                        countryModifier: countryData.countryModifier,
                        currentYear: 2024,
                        currentMonth: 7,
                        newsReport: countryData.newsReport,
                    },
                },
            },
        });

        return new Response(JSON.stringify(updatedParticipant), {
            status: 200, // OK
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('Internal Server Error:', error);
        
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma is disconnected
    }
}
