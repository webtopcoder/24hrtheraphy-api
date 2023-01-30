import { forwardRef, Module } from "@nestjs/common";
import { ConfigService } from "nestjs-config";
import { AuthModule } from "../auth/auth.module";
import { PaymentModule } from "../payment/payment.module";
import { UserModule } from "../user/user.module";
import { CoinbaseController } from "./controllers/coinbase.controller";
import { CoinbaseService } from "./services/coinbase.service";
import { Client } from "coinbase-commerce-node";
import { TokenPackageModule } from "../token-package/token-package.module";

@Module({
  imports: [
    PaymentModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    TokenPackageModule
  ],
  controllers: [CoinbaseController],
  providers: [CoinbaseService]
})
export class CoinbaseModule {
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    const apiKey = this.configService.get("coinbase.apiKey");
    Client.init(apiKey);
  }
}
