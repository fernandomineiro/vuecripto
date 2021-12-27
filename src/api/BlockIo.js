const dev = process.env.NODE_ENV !== "production";
const wsUri = process.env.VUE_APP_DEFAULT_BTC_WS || "wss://n.block.io/";

export default class BlockIo {
  constructor(onOpen = null, onMessage = null, onClose = null) {
    // Start WS
    this.ws = new WebSocket(wsUri);

    this.listenList = [];

    // On open callback
    if (onOpen) {
      this.ws.onopen = onOpen;
    }

    // On message callback
    if (onMessage) {
      this.ws.onmessage = ({ data }) => onMessage(JSON.parse(data));
    }

    // On close callback
    if (onClose) {
      this.ws.onclose = onClose;
    } else {
      this.ws.onclose = () => {
        if (dev) console.log("BlockIO >> Connection closed");
      };
    }
  }

  addAddressListener(network, address) {
    this.ws.send(
      JSON.stringify({
        network: network + (dev ? "TEST" : ""), // Enforce testnet on dev env
        type: "address",
        address: address
      })
    );
    this.listenList.push({ network, address });
  }

  get listening() {
    return this.listenList;
  }

  hasListenerForNetwork(network) {
    return this.listenList.some(x => x.network == network);
  }

  close() {
    this.ws.close();
  }
}
