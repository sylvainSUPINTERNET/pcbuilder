import { getComponentInfos } from "./services/topachat";

( async () => {
    const resp = await getComponentInfos();
    console.log(resp);
})();

