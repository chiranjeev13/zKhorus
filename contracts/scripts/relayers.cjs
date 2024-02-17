const { Defender } = require("@openzeppelin/defender-sdk");

const credentials = {
  apiKey: "5aLVb8hP2HpAxB37hoS5jJricBMqJ8En",
  relayerApiKey: "5aLVb8hP2HpAxB37hoS5jJricBMqJ8En",
  apiSecret: "1YHhvPKU1bMqAGEL4Hrw34yqoYPtTqo22CLU9Q9jSLe3LBA58Q3YxjNbdmScQiSZ",
  relayerApiSecret:
    "1YHhvPKU1bMqAGEL4Hrw34yqoYPtTqo22CLU9Q9jSLe3LBA58Q3YxjNbdmScQiSZ",
};
const client = new Defender(credentials);

async function getProvider() {
  return client.relaySigner.getProvider();
}

getProvider()
  .then((provider) => {
    console.log(provider);
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
