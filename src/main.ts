import { generateDatasetINaturalist } from "./services/inaturalistPicturesExtractor";
import { getComponentInfos } from "./services/topachat";

( async () => {
    // const resp = await getComponentInfos();

    await generateDatasetINaturalist();

})();

