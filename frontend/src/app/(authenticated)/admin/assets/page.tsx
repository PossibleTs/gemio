'use client';
import { Box, Flex } from '@chakra-ui/react';
import PageLoading from '@app/components/ui/page-loding';
import PageTitle from '@app/components/ui/page-title';
import Table from "@app/components/Table";
import Column from "@app/components/Table/Column";
import moment from "moment";
import useBaseAssetsController from '@app/hooks/assets/useBaseAssetsController';
import useAssetsController from '@app/hooks/assetsAdmin/useAssetsController';
import ActionsColumn from '@app/components/ActionsColumn';
import ConfirmActionModal from '@app/components/ui/confirm-modal';
import HashscanLink from '@app/components/ui/hashscan-link';

export default function Assets() {
  const baseAssetsController = useBaseAssetsController();

  const { 
    isLoading, 
    pagination,
    handleSearchFilters,
    tableData
  } = baseAssetsController;

  const { 
    handleApprove,
    isLoadingApprove,
    handleIsOpenApproveModal,
    approveModalIsOpen
  } = useAssetsController(baseAssetsController);

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Equipamentos</PageTitle>
        </Flex>
      </Flex>

      <Table
        dataSource={tableData ?? []}
        keyExpr="ass_id"
        pagination={pagination}
        colSpan={13}
      >
        <Column
          order={pagination.order}
          caption="Empresa"
          dataField={"com_company"}
          handleSearchFilters={(filters) =>
            handleSearchFilters({ com_name: filters.com_company })
          }
          orderAndFilterField="com_name"
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) => component.value.com_name}
        />
        <Column
          order={pagination.order}
          caption="Coleção"
          dataField={"col_collection"}
          handleSearchFilters={(filters) =>
            handleSearchFilters({ col_name: filters.col_collection })
          }
          orderAndFilterField="col_name"
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) => component.value.col_name}
        />
        <Column
          order={pagination.order}
          caption="Coleção ID"
          dataField={"col_collection"}
          handleSearchFilters={(filters) =>
            handleSearchFilters({ col_hedera_token_id: filters.col_collection })
          }
          orderAndFilterField="col_hedera_token_id"
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            <HashscanLink
              value={component.value.col_hedera_token_id}
              path={`token/${component.value.col_hedera_token_id}`}
            />
          }
        />
        <Column
          order={pagination.order}
          caption="Serial do NFT"
          dataField={"format_nft_serial"}
          handleSearchFilters={(filters) =>
            handleSearchFilters({ ass_nft_serial: filters.format_nft_serial })
          }
          orderAndFilterField="ass_nft_serial"
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            <HashscanLink
              value={component.value.ass_nft_serial}
              path={`token/${component.value.col_hedera_token_id}/${component.value.ass_nft_serial}`}
            />
          }
        />
        <Column
          order={pagination.order}
          caption="Nome"
          dataField={"ass_name"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          order={pagination.order}
          caption="Número serial"
          dataField={"ass_serial_number"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          order={pagination.order}
          caption="Fabricante"
          dataField={"ass_manufacturer"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          order={pagination.order}
          caption="Tipo"
          dataField={"ass_machine_type"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          order={pagination.order}
          caption="Modelo"
          dataField={"ass_model"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          width={"100px"}
          order={pagination.order}
          caption="Ano"
          dataField={"ass_manufacture_year"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          order={pagination.order}
          caption="Criado em"
          dataField={"ass_created_at"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          inputType={"date"}
          ValueComponent={(component) =>
            moment(component.value).format("DD/MM/YYYY HH:mm")
          }
        />
        <Column
          order={pagination.order}
          caption="Status"
          dataField={"ass_status"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          isStatus
          disableSearch
          statusOptions={[
            {
              value: "",
              label: "Todos",
            },
            {
              value: "pending",
              label: "Pendente",
            },
            {
              value: "accepted",
              label: "Aprovado",
            },
          ]}
          ValueComponent={(component) => {
            if (component.value === 'pending') {
              return "Pendente"
            } else {
              return "Aprovado"
            }
          }}
        />
        <ActionsColumn
          dataField={"ass_id"}
          actions={["approve"]}
          approveData={handleIsOpenApproveModal}
          displayButtonRules={{
            approve: {
              field: "ass_status",
              matchRule: (status: string) => {
                return status !== 'pending'
              }
            },
          }}
        />
      </Table>

      <ConfirmActionModal
        isLoading={isLoadingApprove}
        isOpen={approveModalIsOpen}
        handleModal={handleIsOpenApproveModal}
        handleSubmit={handleApprove}
        title="Confirmar ação"
        textContent="Tem certeza que ele deseja aprovar esse equipamento?"
      />

      <PageLoading isLoading={isLoading || isLoadingApprove} />

    </Box>
  );
}
