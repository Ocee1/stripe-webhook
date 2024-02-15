import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Readable } from 'stream';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Request() req): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;

    const bodyBuffer = req.user;

    this.stripeService.handleStripeEvent(bodyBuffer, sig);
  }
}
