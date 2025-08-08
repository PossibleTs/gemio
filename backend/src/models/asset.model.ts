import {
  Column,
  Model,
  Table,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Length,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Company } from 'src/models/company.model';
import { MaintenancePermission } from './maintenance-permission.model';
import { Collection } from './collection.model';

@Table({
  tableName: 'ass_asset',
  timestamps: true,
  createdAt: 'ass_created_at',
  updatedAt: 'ass_updated_at',
})
export class Asset extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  ass_id: number;

  @ForeignKey(() => Collection)
  @Column
  ass_col_id: number;

  @ForeignKey(() => Company)
  @Column
  ass_com_id: number;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_name: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_nft_serial: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_machine_type: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_serial_number: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_manufacturer: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_model: string;

  @Column(DataType.INTEGER)
  ass_manufacture_year: number;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_topic_id: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_topic_token_gate_id: string;

  @Length({ max: 255 })
  @Column(DataType.STRING(255))
  ass_metadata_cid: string;

  @Column(DataType.ENUM('pending', 'accepted', 'declined'))
  ass_status: string;

  @Column(DataType.DATE)
  ass_created_at: Date;

  @Column(DataType.DATE)
  ass_updated_at: Date;

  @BelongsTo(() => Collection, { foreignKey: 'ass_col_id' })
  col_collection: Collection;

  @BelongsTo(() => Company, { foreignKey: 'ass_com_id' })
  com_company: Company;

  @HasMany(() => MaintenancePermission, {
    foreignKey: 'map_ass_id',
    sourceKey: 'ass_id',
  })
  map_maintenance_permission: MaintenancePermission[];
}
