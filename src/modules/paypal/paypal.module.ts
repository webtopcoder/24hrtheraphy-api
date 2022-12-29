import { forwardRef, Global, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PaymentModule } from "../payment/payment.module";
import { UserModule } from "../user/user.module";
import { PaypalController } from "./controllers/paypal.controller";
import { PaypalProvider } from "./providers";
import { PaypalService } from "./services/paypal.service";

@Global()
@Module({
  imports: [
    PaymentModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [PaypalController],
  providers: [PaypalProvider, PaypalService]
})
export class PaypalModule {}
