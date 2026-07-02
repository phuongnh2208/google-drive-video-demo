export class UserResponseDto {
  id!: number;
  email!: string;
  name!: string;
  picture!: string;
  createAt!: Date;
  videoClass!: 'CLASS_A' | 'CLASS_B' | null;
}
