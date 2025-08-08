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
  tableName: 'map_maintenance_permission',
  timestamps: true,
  createdAt: 'map_created_at',
  updatedAt: 'map_updated_at',
})
export class MaintenancePermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  map_id: number;

  @ForeignKey(() => Company)
  @Column
  map_com_id: number;

  @ForeignKey(() => Asset)
  @Column
  map_ass_id: number;

  @Column
  map_tokengate_serial: number;

  @Column(DataType.DATE)
  map_start_date: string;

  @Column(DataType.DATE)
  map_end_date: string;

  @Column(DataType.DATE)
  map_created_at: Date;

  @Column(DataType.DATE)
  map_updated_at: Date;

  @BelongsTo(() => Company, { foreignKey: 'map_com_id' })
  com_company: Company;

  @BelongsTo(() => Asset, { foreignKey: 'map_ass_id' })
  ass_asset: Asset;
}
