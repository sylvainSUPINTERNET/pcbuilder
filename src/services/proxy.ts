import { SocksProxyAgent } from "socks-proxy-agent";


export const generateTorSocksAgent = () => {
    return new SocksProxyAgent(process.env.TOR_SOCKS5!);
}


