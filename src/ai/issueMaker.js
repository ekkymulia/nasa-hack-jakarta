import fs from 'fs/promises'; // Use fs/promises for async file reading
import path from 'path';


export const countryOverview = async (countryName) => {
    try {
        const filePath = path.join(__dirname, './baseNasaData.json');

        const data = await fs.readFile(filePath, 'utf-8');

        const jsonData = JSON.parse(data);

        const countryInfo = jsonData.find(country => country.name.toLowerCase() === countryName.toLowerCase());

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

export const issuemaker = async (countryName) => {
    try {
        const filePath = path.join(__dirname, './baseNasaData.json');

        const data = await fs
    } catch (error) {
        console.error(`Error reading country data: ${error.message}`);
        throw error;
    }
}