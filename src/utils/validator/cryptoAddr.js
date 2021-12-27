import { validate as WAValidate } from "wallet-address-validator";

const validate = (value, args) =>
  WAValidate(
    value,
    args[0],
    process.env.NODE_ENV !== "production" ? "testnet" : "prod"
  );

export default validate;
