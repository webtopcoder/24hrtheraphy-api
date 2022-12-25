import { Global, Module, } from "@nestjs/common";
import { PaypalController } from "./controllers/paypal.controller";
import { PaypalProvider } from "./providers";

@Global()
@Module({
  controllers: [PaypalController],
  providers: [PaypalProvider]
})
export class PaypalModule {}
