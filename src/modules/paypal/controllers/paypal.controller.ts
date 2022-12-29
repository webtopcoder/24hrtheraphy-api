import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BraintreeGateway, TransactionRequest } from "braintree";
import { DataResponse } from "src/kernel";
import { CurrentUser, Roles } from "src/modules/auth/decorators";
import { RoleGuard } from "src/modules/auth/guards";
import { OrderService } from "src/modules/payment/services";
import { UserDto } from "src/modules/user/dtos";
import { InjectPaypal } from "../decorators";
import { PaypalCheckoutDto } from "../dtos/PaypalCheckout.dto";
import { PaypalService } from "../services/paypal.service";

@Controller("paypal")
export class PaypalController {
  constructor(
    @InjectPaypal() readonly braintree: BraintreeGateway,
    private readonly orderService: OrderService,
    private readonly paypalService: PaypalService
  ) {}

  @Get("/client_token")
  async generateClientCode() {
    const clientTokenRes = await this.braintree.clientToken.generate({});
    return DataResponse.ok(clientTokenRes);
  }

  @Roles("user")
  @UseGuards(RoleGuard)
  @Post("/checkout/token/:tokenId")
  async checkoutOrder(
    @CurrentUser() user: UserDto,
    @Body() body: PaypalCheckoutDto,
    @Param("tokenId") tokenId: string
  ) {
    const order = await this.orderService.createTokenOrderFromPayload(
      tokenId,
      user
    );
    const saleRequest: TransactionRequest = {
      amount: order.totalPrice.toString(),
      merchantAccountId: "USD",
      paymentMethodNonce: body.nonce,
      options: {
        submitForSettlement: true
      }
    };

    const paypalTransaction = await this.braintree.transaction.sale(
      saleRequest
    );
    if (!paypalTransaction.success) return DataResponse.ok({ ok: false });

    await this.paypalService.paypalSuccessHandler(order, paypalTransaction);
    return DataResponse.ok({ ok: true });
  }
}
