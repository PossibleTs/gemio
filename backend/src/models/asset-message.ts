import {
  Column,
  Model,
  Table,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Asset } from './asset.model';
import { Company } from 'src/models/company.model';

@Table({
  tableName: 'ame_asset_message',
  timestamps: true,
  createdAt: 'ame_created_at',
  updatedAt: 'ame_updated_at',
})
export class AssetMessage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  ame_id: number;

  @ForeignKey(() => Asset)
  @Column
  ame_ass_id: number;

  @ForeignKey(() => Company)
  @Column
  ame_created_by_com_id: number;

  @Column(DataType.STRING(2000))
  ame_message: string;

  @Column(DataType.STRING(255))
  ame_transaction_id: string;

  @Column(DataType.DATE)
  ame_created_at: Date;

  @Column(DataType.DATE)
  ame_updated_at: Date;

  @BelongsTo(() => Company, { foreignKey: 'ame_created_by_com_id' })
  ame_created_by: Company;
}
