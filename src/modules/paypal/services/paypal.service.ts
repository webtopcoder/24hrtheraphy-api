import { Inject, Injectable } from "@nestjs/common";
import {
  OrderModel,
  PaymentTransactionModel
} from "src/modules/payment/models";
import {
  PAYMENT_STATUS,
  TRANSACTION_SUCCESS_CHANNEL
} from "src/modules/payment/constants";
import { PAYMENT_TRANSACTION_MODEL_PROVIDER } from "src/modules/payment/providers";
import { QueueEvent, QueueEventService } from "src/kernel";
import { Transaction, ValidatedResponse } from "braintree";
import { Model } from "mongoose";
import { EVENT } from "src/kernel/constants";

@Injectable()
export class PaypalService {
  constructor(
    @Inject(PAYMENT_TRANSACTION_MODEL_PROVIDER)
    private readonly PaymentTransactionModel: Model<PaymentTransactionModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  private async _createTransactionFromOrder(
    order: OrderModel,
    paymentGateway = "paypal"
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
    paymentTransaction.status = PAYMENT_STATUS.PENDING;
    return paymentTransaction.save();
  }

  async paypalSuccessHandler(
    order: OrderModel,
    paypalTransaction: ValidatedResponse<Transaction>
  ) {
    const transaction = await this._createTransactionFromOrder(order, "paypal");
    if (!transaction || transaction.status !== PAYMENT_STATUS.PENDING) {
      return { ok: false };
    }
    transaction.status = PAYMENT_STATUS.SUCCESS;
    transaction.paymentResponseInfo = paypalTransaction;
    await transaction.save();
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: transaction
      })
    );
  }
}
