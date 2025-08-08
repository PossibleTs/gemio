export type AssetDto = {
  ass_id: number;
  ass_col_id: number;
  ass_com_id: number;
  ass_name: string;
  ass_nft_serial: number;
  ass_machine_type: string;
  ass_serial_number: string;
  ass_manufacturer: string;
  ass_model: string;
  ass_manufacture_year: number;
  ass_topic_id: string;
  ass_topic_token_gate_id: string;
  ass_metadata_cid: string;
  ass_status: string;
  ass_created_at: string;
  ass_updated_at: string;
  com_company: {
    com_id: number;
    com_name: string;
    com_cnpj: string;
    com_hedera_account_id: string;
  };
  col_collection: {
    col_id: number;
    col_hedera_token_id: string;
    col_name: string;
    col_symbol: string;
  };
};