import axios from "axios";
import fs from "fs";
import { supabaseClient } from "../main";
import { Database } from "../supabase";
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

    let isLocked:boolean = true;

    // Unlock download if lastHash is empty
    if ( lastHash === ""  ) {
        isLocked = false;
    }

    let hashs: Array<string> = [];

    for (const componentName of topachatUrls) {
        
        const data = fs.readFileSync(`./src/dataset/topachat/${componentName}_info.json`, 'utf8');
        const {content} = JSON.parse(data).result;


        for ( const [idx, key] of Object.keys(content).entries() )  {
            

            if ( content[key].media.main.hash_id && content[key].media.main.hash_id ) {

                if ( content[key].media.main.hash_id === lastHash && isLocked ) {
                    isLocked = false;
                    console.log("Unlocking download ...");
                }

                if ( !isLocked ) {

                    hashs.push(content[key].media.main.hash_id);

                    console.log(`Downloading ${content[key].media.main.hash_id} ...`);

                    // e.g https://media.topachat.com/media/s200/<hash_id>.webp
                    
                    // if ( idx % waterMark == 0 && idx !== 0 ) {
                    //     console.log(`Waiting for : ${delay / 1000} ... `);
                    //     await new Promise((resolve) => setTimeout(resolve, delay + idx * 1000));
                    // }

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
                } else {
                    console.log(`Locked,  ${content[key].media.main.hash_id} ignored => waiting for ${lastHash} to unlock...`);
                }




            }

        };

    };


    console.log("Medias to download : ", hashs.length);
    hashs.length = 0;
}

/**
 * Associate JSON file to media file donwloaded
 */
export const associateJsonToMediaAndSaveToDb = async () => {


    let toInsert: Array<Database['public']['Tables']['components']['Insert']> = [];

    const files = await fs.promises.readdir('./src/dataset/topachat/medias');
    const imageFiles = files
    .filter((file:string) => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp'));
    
    const imageFilesSet:Set<string> = new Set([...imageFiles]);
    

    for (const componentName of topachatUrls) {
        const data = fs.readFileSync(`./src/dataset/topachat/${componentName}_info.json`, 'utf8');
        const {content} = JSON.parse(data).result;

        for ( const [idx, key] of Object.keys(content).entries() )  {   

            if ( imageFilesSet.has(`${content[key].media.main.hash_id}_${key}.webp`) ) {
                toInsert = [...toInsert, {
                    "constructor_brand": content[key].brand,
                    "label": content[key].label,
                    "price_market": content[key].price_market,
                    "sublabel": content[key].sublabel,
                    "media_path": `./src/dataset/topachat/medias/${content[key].media.main.hash_id}_${key}.webp`,
                }]
            };
            };
    };

    if ( toInsert.length > 0 ) {

        try {
            const data = await supabaseClient
            .from('components')
            .upsert(toInsert, { onConflict: 'constructor_brand,label', ignoreDuplicates: true })

            console.log("Insertion done : ", toInsert.length);
            return data;
        } catch ( e ) {
            console.log(e);
            return null;
        }
    }

    return null;
}
