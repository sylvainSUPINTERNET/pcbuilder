
import dotenv from "dotenv";
dotenv.config();

import { generateDatasetINaturalist } from "./services/inaturalistPicturesExtractor";
import { extractHashAndDownloadPictures, getComponentInfos } from "./services/topachat";
import axios from "axios";
import { generateTorSocksAgent } from "./services/proxy";

( async () => {

    // AI model => collab 37 ( model trained / testable on roboflow )
    // await generateDatasetINaturalist();


    // Grab components info as JSON file 
    // await getComponentInfos();


    // const lastHash = "619f5a632572885fae311820";
    // await extractHashAndDownloadPictures(lastHash);


    await associateJsonToMedia();


    
})();

