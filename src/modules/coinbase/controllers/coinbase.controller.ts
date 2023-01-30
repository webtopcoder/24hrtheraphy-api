import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { resources, Webhook } from "coinbase-commerce-node";
import { Request, Response } from "express";
import { ConfigService } from "nestjs-config";
import { CurrentUser, Roles } from "src/modules/auth/decorators";
import { RoleGuard } from "src/modules/auth/guards";
import { MailerService } from "src/modules/mailer";
import { PAYMENT_STATUS } from "src/modules/payment/constants";
import { PaymentTransactionModel } from "src/modules/payment/models";
import { OrderService } from "src/modules/payment/services";
import { PaymentTokenService } from "src/modules/purchased-item/services";
import { UserDto } from "src/modules/user/dtos";
import { UserService } from "src/modules/user/services";
import { CoinbaseChargeDto } from "../dtos/CoinbaseCharge.dto";

import { CoinbaseService } from "../services/coinbase.service";

@Controller("coinbase")
export class CoinbaseController {
  constructor(
    private readonly coinbaseService: CoinbaseService,
    private readonly configService: ConfigService,
    private readonly orderService: OrderService
  ) {}

  @Roles("user")
  @UseGuards(RoleGuard)
  @Post("charge")
  async charge(@Body() body: CoinbaseChargeDto, @CurrentUser() user: UserDto) {
    const charge = await this.coinbaseService.createCharge(user, body);
    return charge;
  }

  @Post("webhook")
  async webhookHandler(
    @Req() req: Request,
    @Body() rawBody: Buffer,
    @Res() res: Response
  ) {
    const webhookSecret = this.configService.get("coinbase.webhookSecret");
    const signature = req.headers["x-cc-webhook-signature"] as string;

    if (!webhookSecret) {
      console.error("Webhook Secret is not setup");
      return res.status(500).send({ message: "Server Exception" });
    }

    if (!signature)
      return res.status(400).send({ message: "Invalid Signature" });

    let event: resources.Event;
    try {
      event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Webhook Error" });
    }

    type EventTransactionStatus = Partial<
      Record<typeof event.type, PAYMENT_STATUS>
    >;
    const eventTransactionStatus: EventTransactionStatus = {
      "charge:pending": PAYMENT_STATUS.PENDING,
      "charge:confirmed": PAYMENT_STATUS.SUCCESS,
      "charge:failed": PAYMENT_STATUS.CANCELLED
    };

    let transactionId: string;

    try {
      transactionId = event.data?.metadata?.transactionId;
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Webhook Error" });
    }

    if (!transactionId)
      return res.status(400).send({ message: "Wrong Metadata" });

    const transaction = await this.coinbaseService.getTransactionById(
      transactionId
    );

    const userId = transaction.buyerId;

    if (event.type === "charge:confirmed") {
      await this.coinbaseService.coinbaseWebhookHandler(
        transaction,
        eventTransactionStatus[event.type],
        event.data
      );
    }

    return res.status(200).send({ message: "event recieved" });
  }
}
