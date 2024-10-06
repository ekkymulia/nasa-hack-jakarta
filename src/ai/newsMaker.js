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
    ["system", `Use JSON data below to make a news of issue and steps that have been tooken that happen in a country. Provide 3 news in the response in the following JSON format: 
    [
            "news_outlet": "news_outlet",
            "news_headline": "news_headline, depends on the issue and action taken, choice of words could attack or defend the government or neutral",
            "news_story": "news_story, 200-300 words",
            "public_opinion": [
                "sentiment": "sentiment",
                "modifier_to_country": [
                    "public_modifier_item": "what is it effecting for the public (e.g. economy, health, etc.)",
                    "value_affected": "value_affected"
                ] make 2-3 public modifier items
            ]
    ]`],
    ["human", "Country Data: {country_data}. Addressed Issues Before: {addressed_issue}"],
]);

const runnableAgent = RunnableSequence.from([
    prompt,
    model,
]);

export const newsmaker = async (country_data, addressed_issue) => {
    try {
        const result = await runnableAgent.invoke({ country_data, addressed_issue });
        console.log(result.content); // Log the result content
        return result.content;
    } catch (error) {
        console.error(`Error generating issues: ${error.message}`);
        throw error;
    }
};


