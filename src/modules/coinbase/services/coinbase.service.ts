import { Inject, Injectable } from "@nestjs/common";
import {
  ChargeResource,
  Client,
  CreateCharge,
  resources
} from "coinbase-commerce-node";
import { Model } from "mongoose";
import {
  EntityNotFoundException,
  QueueEvent,
  QueueEventService
} from "src/kernel";
import { EVENT } from "src/kernel/constants";
import {
  PAYMENT_STATUS,
  TRANSACTION_SUCCESS_CHANNEL
} from "src/modules/payment/constants";
import {
  OrderModel,
  PaymentTransactionModel
} from "src/modules/payment/models";
import { PAYMENT_TRANSACTION_MODEL_PROVIDER } from "src/modules/payment/providers";
import { OrderService } from "src/modules/payment/services";
import { TokenPackageService } from "src/modules/token-package/services";
import { UserDto } from "src/modules/user/dtos";

import { CoinbaseChargeDto } from "../dtos/CoinbaseCharge.dto";

const { Charge } = resources;

@Injectable()
export class CoinbaseService {
  constructor(
    @Inject(PAYMENT_TRANSACTION_MODEL_PROVIDER)
    private readonly PaymentTransactionModel: Model<PaymentTransactionModel>,
    private readonly tokenService: TokenPackageService,
    private readonly orderService: OrderService,
    private readonly queueEventService: QueueEventService
  ) {}

  private async _createTransactionFromOrder(
    order: OrderModel,
    paymentGateway = "coinbase"
  ) {
    const paymentTransaction = new this.PaymentTransactionModel();
    paymentTransaction.orderId = order._id;
    paymentTransaction.paymentGateway = paymentGateway;
    paymentTransaction.buyerSource = order.buyerSource;
    paymentTransaction.buyerId = order.buyerId;
    paymentTransaction.type = order.type;
    paymentTransaction.totalPrice = order.totalPrice;
    paymentTransaction.products = [
      {
        name: order.name,
        description: order.description,
        price: order.totalPrice,
        productType: order.productType,
        productId: order.productId,
        quantity: order.quantity,
        extraInfo: null
      }
    ];
    paymentTransaction.paymentResponseInfo = null;
    paymentTransaction.status = PAYMENT_STATUS.INITIATED;
    return paymentTransaction.save();
  }

  async getTransactionById(id: string) {
    const transaction = await this.PaymentTransactionModel.findById(id);
    if (!transaction) throw new EntityNotFoundException();
    return transaction;
  }

  async createCharge(user: UserDto, chargeRequestBody: CoinbaseChargeDto) {
    const packageToken = await this.tokenService.findById(
      chargeRequestBody.tokenPackage
    );
    if (!packageToken) throw new EntityNotFoundException();
    const order = await this.orderService.createTokenOrderFromPayload(
      chargeRequestBody.tokenPackage,
      user
    );
    const transaction = await this._createTransactionFromOrder(order);

    const chargeData: CreateCharge = {
      name: packageToken.name,
      description: packageToken.description,
      local_price: {
        amount: packageToken.price.toFixed(2),
        currency: "USD"
      },
      pricing_type: "fixed_price",
      metadata: {
        transactionId: transaction.id
      }
    };

    const charge = await Charge.create(chargeData);

    if (!charge)
      throw new Error("Something went wrong when creating charge on Coinbase");

    return charge;
  }

  async coinbaseWebhookHandler(
    transaction: PaymentTransactionModel,
    status: PAYMENT_STATUS,
    paymentTransaction?: any
  ) {
    transaction.status = PAYMENT_STATUS.SUCCESS;
    transaction.paymentResponseInfo = paymentTransaction;
    await transaction.save();
    if (status === PAYMENT_STATUS.SUCCESS)
      await this.queueEventService.publish(
        new QueueEvent({
          channel: TRANSACTION_SUCCESS_CHANNEL,
          eventName: EVENT.CREATED,
          data: transaction
        })
      );
  }
}
