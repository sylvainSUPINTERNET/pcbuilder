import * as gpu_data_topachat from "./mocks/gpu_data_topachat.json";
import fs from "fs";
import { getComponentInfos } from "./services/topachat";
// import { getGpuList } from "./services/topachat";

( async () => {
    // const gpuData = await getGpuList();
    // fs.writeFileSync("./src/mocks/gpu_data_topachat.json", JSON.stringify(gpuData));
    const resp = await getComponentInfos();
    console.log(resp);
    
})();

