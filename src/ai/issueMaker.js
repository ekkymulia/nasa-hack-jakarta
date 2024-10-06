import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises'; // Use fs/promises for async file reading
import path from 'path';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { base_nasa } from './baseNasaData';

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Function to load base countries asynchronously
// const loadBaseCountries = async () => {
//     const filePath = path.join(process.cwd(), 'src/app/api/issue/baseNasaData.json');
    
//     try {
//         const data = await fs.readFile(filePath, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error('Error reading baseCountry.json:', error);
//         throw new Error('Could not load country data');
//     }
// };

export const countryOverview = async (countryName) => {
    try {
        const countries = base_nasa; // Load the countries from the JSON file
        const countryInfo = countries.find(
            country => country.countryName === countryName
        );
        // console.log(countries, countryName, 'sdfsfs');
        
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
    ["system", `Use JSON data below to identify issues that might happen in a country. Provide 3 issues in the response in the following JSON format: 
    [
            "issue": "issue1",
            "issue_story": "issue_story, sometime could be direct or indirect like an opinion story, tell a background first or the history of the problem, then slow to the problem",
            "debate_solution": [
                "solution": "solution, create the text as if it was a story suggested by the government underlings",
                "modifier_to_country": [
                        "protocol_item": "protocol_item",
                        "value_affected": "value_affected"
                ]
            ] make 3-4 solutions but some good and some bad and some maybe mediocre
    ]
    the issue could be 
    Climate Events: Use Atmosphere datasets like Air Temperature Dailies, Precipitation, and Winds to generate weather-related events (e.g., heatwaves, hurricanes, droughts).
    Environmental Policies: Leverage Biosphere and Hydrosphere data (e.g., Carbon Cycle, Water Quality) to create events around deforestation, pollution, and conservation efforts.
    Public Health Crises: Utilize Hydrosphere datasets like Mosquito Habitat Mapper and Dissolved Oxygen to generate events related to disease outbreaks or water quality issues.
    Economic Policies: Barometric Pressures and Air Temperature data can influence economic indicators like agriculture output and energy consumption.
    Infrastructure Development: Soil Moisture and Soil Temperature datasets can affect building projects, urban planning, and disaster resilience.

    Or Adaptive Event Creation
    Storyline Development: AI crafts narratives around data trends, such as urban expansion impacting Vegetation Covers or industrial growth affecting Water Quality.
    `],
    ["human", "Country Data: {country_data}. Addressed Issues Before: {addressed_issue}"],
]);

const runnableAgent = RunnableSequence.from([
    prompt,
    model,
]);

export const issuemaker = async (country_data, addressed_issue) => {
    try {
        const result = await runnableAgent.invoke({ country_data, addressed_issue });
        // console.log(result.content); // Log the result content
        return result.content;
    } catch (error) {
        // console.error(`Error generating issues: ${error.message}`);
        throw error;
    }
};  
