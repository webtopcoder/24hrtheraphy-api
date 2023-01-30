import { IsNotEmpty, IsString } from "class-validator";

export class CoinbaseChargeDto {
  @IsString()
  @IsNotEmpty()
  tokenPackage: string;
}
