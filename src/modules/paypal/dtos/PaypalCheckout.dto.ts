import { IsNotEmpty, IsString } from "class-validator";

export class PaypalCheckoutDto {
  @IsString()
  @IsNotEmpty()
  nonce: string;
}
