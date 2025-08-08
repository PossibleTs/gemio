import {
  Column,
  Model,
  Table,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Length,
  HasMany,
} from 'sequelize-typescript';
import { Asset } from './asset.model';

@Table({
  tableName: 'col_collection',
  timestamps: true,
  createdAt: 'col_created_at',
  updatedAt: 'col_updated_at',
})
export class Collection extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  col_id: number;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  col_hedera_token_id: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  col_name: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  col_symbol: string;

  @Length({ max: 2000 })
  @Column(DataType.STRING(2000))
  col_description: string;

  @Column(DataType.ENUM('active'))
  col_status: string;

  @Column(DataType.DATE)
  col_created_at: Date;

  @Column(DataType.DATE)
  col_updated_at: Date;

  @HasMany(() => Asset, { foreignKey: 'ass_col_id' })
  ass_asset: Asset[];
}
