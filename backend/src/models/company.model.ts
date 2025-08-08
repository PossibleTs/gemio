import {
  Column,
  Model,
  Table,
  DataType,
  AutoIncrement,
  Default,
  PrimaryKey,
  Length,
  DefaultScope,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import { MaintenancePermission } from './maintenance-permission.model';
import { AssetMessage } from './asset-message';
import { Asset } from './asset.model';

@DefaultScope(() => ({
  attributes: {
    exclude: ['com_hedera_mnemonic_phrase', 'com_hedera_private_key'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: {
      include: ['com_hedera_mnemonic_phrase', 'com_hedera_private_key'],
    },
  },
}))
@Table({
  tableName: 'com_company',
  timestamps: true,
  createdAt: 'com_created_at',
  updatedAt: 'com_updated_at',
})
export class Company extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  com_id: number;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  com_name: string;

  @Length({ min: 14, max: 14 })
  @Column(DataType.STRING(14))
  com_cnpj: string;

  @Column(DataType.ENUM('creator', 'owner', 'maintainer'))
  com_type: string;

  @Column(DataType.BOOLEAN)
  com_create_wallet: boolean;

  @Length({ max: 30 })
  @Column(DataType.STRING(30))
  com_hedera_account_id: string;

  @Length({ max: 300 })
  @Column(DataType.STRING(300))
  com_hedera_mnemonic_phrase: string;

  @Length({ max: 300 })
  @Column(DataType.STRING(300))
  com_hedera_private_key: string;

  @Default('pending')
  @Column(DataType.ENUM('pending', 'approved'))
  com_approval_status: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  com_is_active: boolean;

  @Column(DataType.STRING(255))
  com_hedera_history_id: string;

  @Column(DataType.DATE)
  com_created_at: Date;

  @Column(DataType.DATE)
  com_updated_at: Date;

  @HasMany(() => Asset, { foreignKey: 'ass_id' })
  asset: Asset[];

  @HasMany(() => MaintenancePermission, { foreignKey: 'map_com_id' })
  map_maintenance_permission: MaintenancePermission[];

  @HasMany(() => AssetMessage, { foreignKey: 'ame_created_by_com_id' })
  ame_asset_message: AssetMessage[];
}
