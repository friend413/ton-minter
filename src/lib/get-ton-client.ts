import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { getNetwork } from "./hooks/useNetwork";

const endpointP = "https://toncenter.com/api/v2/jsonRPC";
const apiKey = "854c26173743d51b11e088eb13d9d61ed277693d195345e89081cb6beab4d15f";

async function _getClient() {
  console.log("endpoint", endpointP);

  return new TonClient({
    endpoint: await endpointP,
    apiKey: await apiKey,
  });
}

const clientP = _getClient();

export async function getClient() {
  return clientP;
}

export async function getEndpoint() {
  return endpointP;
}
