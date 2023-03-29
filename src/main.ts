
import dotenv from "dotenv";
dotenv.config();

import { generateDatasetINaturalist } from "./services/inaturalistPicturesExtractor";
import { associateJsonToMediaAndSaveToDb, extractHashAndDownloadPictures, getComponentInfos } from "./services/topachat";
import axios from "axios";
import { generateTorSocksAgent } from "./services/proxy";
import { createClient } from "@supabase/supabase-js";
import { constants } from "./constants/constants";
import { Database } from "./supabase";


export const supabaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);

( async () => {

    try {

    // Make sure to start your local TOR node before running this script

    /* Getting json from components API */
    // await getComponentInfos();

    /* Getting media associated to json */
    // const lastHash = "";
    // await extractHashAndDownloadPictures(lastHash);


    /* Associate json to media and insert into supabase */
    const result = await associateJsonToMediaAndSaveToDb();
    console.log(result)

    } catch ( e ) {
        console.log(e);
    }
    
})();

