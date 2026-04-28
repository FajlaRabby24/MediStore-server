import z from "zod";
import { CustomerValidations } from "./customer.validation";

export type ICreateSellerRequestPayload = z.infer<
  typeof CustomerValidations.createSellerRequestValidationSchema
>;
