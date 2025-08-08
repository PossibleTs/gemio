export type MessagesDto = {
  ame_id: number,
  ame_ass_id: number,
  ame_created_by_com_id: number,
  ame_message: string,
  ame_created_at: string,
  ame_updated_at: string,
  ame_transaction_id: string,
  ame_created_by: {
    com_id: number,
    com_name: string,
    com_cnpj: string,
    com_hedera_account_id: string
  }
};