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
export const extractHashAndDownloadPictures = () => {

    let hashs: Array<string> = [];

    topachatUrls.map( async ( componentName: string, index:number ) => {
        
        const data = fs.readFileSync(`./src/dataset/topachat/${componentName}_info.json`, 'utf8');
        const {content} = JSON.parse(data).result;

        Object.keys(content).map( async (key:string, idx:number) => {

            // e.g https://media.topachat.com/media/s200/<hash_id>.webp

            if ( content[key].media.main.hash_id ) {
                hashs.push(content[key].media.main.hash_id);

                if ( idx === 1 ) {

                    try {
                        const response = await axios({
                            url: `https://media.topachat.com/media/s200/${content[key].media.main.hash_id}.webp`,
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
            }

        });

    });


    console.log("Medias to download : ", hashs.length);
}
