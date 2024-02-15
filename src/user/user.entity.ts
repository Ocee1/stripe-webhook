import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema()
export class UserEntity {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 'unpaid' })
  status?: string;
}

// export type UserEntityDocument = UserEntity & Document;
export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);

UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await bcrypt.hash(this.password, 11);
  next();
});
