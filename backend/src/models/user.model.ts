import {
  Column,
  Model,
  Table,
  DataType,
  AutoIncrement,
  Default,
  PrimaryKey,
  Length,
  ForeignKey,
  BeforeCreate,
  BeforeUpdate,
  DefaultScope,
  Scopes,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/models/company.model';

@DefaultScope(() => ({
  attributes: {
    exclude: ['usr_password'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: {
      include: ['usr_password'],
    },
  },
}))
@Table({
  tableName: 'usr_user',
  timestamps: true,
  createdAt: 'usr_created_at',
  updatedAt: 'usr_updated_at',
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  usr_id: number;

  @ForeignKey(() => Company)
  @Column
  usr_com_id: number;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  usr_name: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  usr_email: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  usr_password: string;

  @Column(DataType.ENUM('admin', 'company'))
  usr_permission: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  usr_is_active: boolean;

  @Column(DataType.STRING(255))
  usr_hedera_history_id: string;

  @Column(DataType.DATE)
  usr_created_at: Date;

  @Column(DataType.DATE)
  usr_updated_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static async password(instance: User) {
    if (instance.dataValues.usr_password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(
        instance.dataValues.usr_password,
        salt,
      );

      instance.dataValues.usr_password = passwordHash;
    }
  }
}
