import { Provider } from "@nestjs/common";
import { BraintreeGateway, Environment } from "braintree";
import { ConfigService } from "nestjs-config";
import { PAYPAL_CLIENT } from "../constants";

export const PaypalProvider: Provider = {
  provide: PAYPAL_CLIENT,
  useFactory: (configService: ConfigService) => {
    const accessToken = configService.get("paypal.accessToken");
    const NODE_ENV = configService.get("app.NODE_ENV");
    const gateway = new BraintreeGateway({
      environment:
        NODE_ENV === "production"
          ? Environment.Production
          : Environment.Sandbox,
      accessToken
    });
    return gateway;
  },
  inject: [ConfigService]
};
