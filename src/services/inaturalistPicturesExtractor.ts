import fs, { createWriteStream, mkdir } from "fs";
import * as stream from 'stream';
import { promisify } from 'util';
import axios from "axios";
import sharp from "sharp";

const finished = promisify(stream.finished);

const datasetPath = "./src/dataset/";


// square ( small ) or medium 
const imageSize = "medium";

/* https://api.inaturalist.org/v1/observations?verifiable=true&order_by=observations.id&order=desc&page=5&spam=false&taxon_id=34435&locale=fr&per_page=24
 */

const baseUrl: String = "https://api.inaturalist.org/v1/observations"

// TODO : manage pagination for all taxonIds ( currently manage only for the first one ...)
const urlsBuilder = (taxonIds: string[] = ["34435"], page:number=10, perPage:number=25, locale:"fr"="fr"): Array<string> => {
    return taxonIds.map( taxonId => `${baseUrl}?verifiable=true&order_by=observations.id&order=desc&page=${page}&spam=false&taxon_id=${taxonId}&locale=${locale}&per_page=${perPage}` );
}

export const getINaturalistSpeciesInfo = async () => {

    const DELAY:number = 3000;
    
    const urls = urlsBuilder().map( async ( url: string, index:number ) => {
        
        await new Promise((resolve) => setTimeout(resolve, index * DELAY));
    
        console.log(`Fetching ${url} ...`)

        const response = await fetch(url);
        const data = await response.json();

        return data;
    }); 

    try {
        const responses = await Promise.all(urls);

        return responses;

    } catch ( e ) {
        console.log(e);
    }
}

export const generateDataset = async (results:any) => {

    results.map( (result:any, index:number) => {
        const specieName = result.taxon.name.replace(" ", "_").toLowerCase();
        const identificationMediumUrlPicture = result.photos[0].url.replace("square", imageSize);

        const folderPath = `${datasetPath}${specieName}`;
        const fullPath = `${datasetPath}${specieName}/${specieName}_${index}.jpg`;
        
        mkdir(folderPath, { recursive: true }, (err) => {
            if (err) throw err;

            // Create the write stream and write to the file
            const writeStream = createWriteStream(fullPath);

            axios.get(`${identificationMediumUrlPicture}`, {
                "responseType": "stream"
            }).then( response => {
                response.data
                // .pipe(sharp().resize(dimension.width, dimension.height))
                .pipe(writeStream);
                return finished;
            });
        });


    });
}


export const generateDatasetINaturalist = async () => { 
    try {
        console.log("Extracting dataset from INaturalist ...")

        const jsonDataArray =  await (getINaturalistSpeciesInfo() as any);
        const dataset = await generateDataset(jsonDataArray[0].results);

        console.log("Extraction done with success");
    } catch ( e ) {
        console.log(e);
    }

}