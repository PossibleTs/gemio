export type PermissionDto = {
  map_id: number;
  map_com_id: number;
  map_ass_id: number;
  map_start_date: string; 
  map_end_date: string | null;
  map_created_at: string;
  map_updated_at: string;
  map_tokengate_serial: number
  com_company: {
    com_id: number;
    com_name: string;
    com_cnpj: string;
    com_hedera_account_id: string;
  };
  ass_asset: {
    ass_topic_token_gate_id: string
  }
};