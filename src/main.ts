
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

    
/*     axios({
      url: 'https://ifconfig.me',
      httpsAgent: generateTorSocksAgent(),
    })
    .then(({
      data
    }) => {
      console.log(data);
    });
 */


    await extractHashAndDownloadPictures();
    
})();

