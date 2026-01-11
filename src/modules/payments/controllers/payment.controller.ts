import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ProcessPaymentDto } from "../dto/process-payment.dto";
import { ProcessPaymentUseCase } from "../use-cases/process-payment.use-case";

@ApiTags("payments")
@ApiBearerAuth()
@Controller("payments")
export class PaymentController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Processar pagamento" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Pagamento processado com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Erro ao processar o pagamento",
  })
  async create(@Body() body: ProcessPaymentDto){
    return this.processPaymentUseCase.execute(body);
  }
}
