// stripe/stripe.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from 'src/user/user.entity';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private configService: ConfigService
  private stripe = new Stripe('sk_test_51OjqzlCTyYLxvamGxyU8u6HWUbh8zTwtPmTRyIJiTlOZFu6AV1DhQ9jHxsUdhTcaHj6PMTV2rcQac3RxaLJt4Vq000NxlJF2OY');
  @InjectModel(UserEntity.name)
  private userModel: Model<UserEntity>;

  async handleStripeEvent(requestBody: Buffer, sig: string): Promise<void> {
    try {
      const endpointSecret = 'STRIPE_ENDPOINT_SECRET';
      const event = this.stripe.webhooks.constructEvent(
        requestBody,
        sig,
        endpointSecret,
      );

      // Handle different Stripe events based on their type
      if (event.type == 'payment_intent.succeeded') {
        console.log({ messge: 'the event obj', event });
        const paymentIntent = event.data.object;
        await this.handleSuccessfulPayment(paymentIntent);
      }
      //   switch (event.type) {
      //     case 'payment_intent.succeeded':
      //       const paymentIntentSucceeded = event.data.object;
      //       // Handle the payment_intent.succeeded event
      //       break;
      //     // Add more cases for other event types as needed

      //     default:
      //       console.log(`Unhandled event type ${event.type}`);
      //   }
    } catch (error) {
      console.error('Error handling Stripe webhook:', error.message);
      throw new HttpException(
        `Webhook Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async handleSuccessfulPayment(paymentIntent: any): Promise<void> {
    // Extract relevant information from paymentIntent
    const userId = paymentIntent.customer;

    // Call a method to update user status to "paid" in the database
    await this.updateUserStatusToPaid(userId);
  }

  private async updateUserStatusToPaid(userId: string): Promise<void> {
    // Your logic to update user status to "paid" in the database
    // This might involve using a service that interacts with your database

    await this.userModel.updateOne({ _id: userId }, { status: 'paid' });
  }
}
