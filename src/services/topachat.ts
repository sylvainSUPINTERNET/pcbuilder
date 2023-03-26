import fs from "fs";

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
            fs.writeFileSync(`./src/mocks/${componentName}_info.json`, JSON.stringify(data));
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

