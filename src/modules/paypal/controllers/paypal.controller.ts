import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { BraintreeGateway, TransactionRequest } from "braintree";
import { InjectPaypal } from "../decorators";
import { PaypalCheckoutDto } from "../dtos/PaypalCheckout.dto";

@Controller("paypal")
export class PaypalController {
  constructor(@InjectPaypal() readonly braintree: BraintreeGateway) {}

  @Get("/client_token")
  async generateClientCode() {
    const clientTokenRes = await this.braintree.clientToken.generate({});
    return clientTokenRes;
  }

  @Post("/checkout")
  async checkoutOrder(@Body() body: PaypalCheckoutDto) {
    const saleRequest: TransactionRequest = {
      // TODO: amount is to be added by what product you'll be selling
      amount: "100",
      merchantAccountId: "USD",
      paymentMethodNonce: body.nonce,
      options: {
        submitForSettlement: true
      }
    };

    const paypalTransaction = await this.braintree.transaction.sale(
      saleRequest
    );
    if (!paypalTransaction.success)
      throw new BadRequestException(paypalTransaction);

    // TODO: create transaction in our server
    return paypalTransaction;
  }
}
