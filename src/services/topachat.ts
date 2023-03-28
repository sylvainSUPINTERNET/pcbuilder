import axios from "axios";
import fs from "fs";
import { generateTorSocksAgent } from "./proxy";

export const baseUrl = `https://www.topachat.com/api/configomatic/get.list.product.php`;

export const topachatUrls = [
    "GFX", // gpu 
    "PRO", // cpu
    "VEN", // ventirad
    "CME", // motherboard
    "PAT", // pate thermique
    "MEM", // ram
    "SM20", // M2
    "DRV2", // SSD1 
    "DRV0", // HDD
    "BOX", // boitier
    "ALM", // alimentation
    "MON0", // monitor
    "MOU", // mouse
    "KEY", // keyboard
]

const generateTopcAchatApiUrl = async ( componentName: string ) => {
    return `${baseUrl}?type=${componentName}&ref_by_selected_type=%7B%7D`
}
export const getComponentInfos = async ( ) => {
    const DELAY:number = 3000;


    const urls = topachatUrls.map( async ( componentName: string, index:number ) => {
        
        await new Promise((resolve) => setTimeout(resolve, index * DELAY));
            const url = await generateTopcAchatApiUrl(componentName);
            console.log(`Fetching ${url} ...`);

            const response = await fetch(url);
            const data = await response.json();
            fs.writeFileSync(`./src/dataset/topachat/${componentName}_info.json`, JSON.stringify(data));
            const {content} = data.result;
            return content;
    }); 

    try {
        const responses = await Promise.all(urls);
        console.log(responses);

    } catch ( e ) {
        console.error(e);
    }
};


/**
 * Read JSON file scrapped
 * Extract hash from JSON
 * Download picture from hash using proxy TOR
 */

// TODO : refactor into recursive function to check if last hash is found, if yes unlock the download of the next pictures

export const extractHashAndDownloadPictures = async (lastHash:string="") => {

    const waterMark = 400;
    const delay = 5000;

    let hashs: Array<string> = [];

    for (const componentName of topachatUrls) {
        
        const data = fs.readFileSync(`./src/dataset/topachat/${componentName}_info.json`, 'utf8');
        const {content} = JSON.parse(data).result;


        for ( const [idx, key] of Object.keys(content).entries() )  {

            // e.g https://media.topachat.com/media/s200/<hash_id>.webp
            
            if ( idx % waterMark == 0 && idx !== 0 ) {
                await new Promise((resolve) => setTimeout(resolve, delay + idx * 1000));
            }

            if ( content[key].media.main.hash_id && content[key].media.main.hash_id !== lastHash) {
                hashs.push(content[key].media.main.hash_id);

                console.log(`Downloading ${content[key].media.main.hash_id} ...`);
                try {
                    const response = await axios({
                        url: `https://media.topachat.com/media/s400/${content[key].media.main.hash_id}.webp`,
                        httpsAgent: generateTorSocksAgent(),
                        responseType: 'stream'
                    });

                    const stream = response.data;
                    // Pipe the stream to a file
                    const file = fs.createWriteStream(`./src/dataset/topachat/medias/${content[key].media.main.hash_id}_${key}.webp`);
                    stream.pipe(file);

                } catch (e) {
                    console.log(e);
                }

            }

        };

    };


    console.log("Medias to download : ", hashs.length);
}

/**
 * Associate JSON file to media file donwloaded
 */
export const associateJsonToMedia = async () => {
    
}
