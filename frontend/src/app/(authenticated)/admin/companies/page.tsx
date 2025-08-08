'use client';
import { Box, Flex } from '@chakra-ui/react';
import useCompaniesController from '@app/hooks/companies/useCompaniesController';
import PageLoading from '@app/components/ui/page-loding';
import PageTitle from '@app/components/ui/page-title';
import ActionsColumn from '@app/components/ActionsColumn';
import Table from "@app/components/Table";
import Column from '@app/components/Table/Column';
import ConfirmActionModal from '@app/components/ui/confirm-modal';
import handleValueMask from '@app/utils/handleValueMask';
import HashscanLink from '@app/components/ui/hashscan-link';

export default function CompaniesPage() {
  const { 
    isLoading, 
    isLoadingApprove, 
    handleIsOpenApproveModal,
    pagination,
    handleSearchFilters,
    tableData,
    approveModalIsOpen,
    handleApprove
  } = useCompaniesController();

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Empresas</PageTitle>
        </Flex>
        <Flex
          justifyContent="flex-end"
          flex="1"
          minWidth="200px"
        >
        </Flex>
      </Flex>

      <Table
        dataSource={tableData.list ?? []}
        keyExpr="id"
        pagination={pagination}
        colSpan={6}
      >
        <Column
          width={"200px"}
          order={pagination.order}
          caption="Conta Hedera"
          dataField={"com_hedera_account_id"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            <HashscanLink
              value={component.value}
              path={`account/${component.value}`}
            />
          }
        />
        <Column
          order={pagination.order}
          caption="Empresa"
          dataField={"com_name"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          width={"150px"}
          order={pagination.order}
          caption="CNPJ"
          dataField={"com_cnpj"}
          handleSearchFilters={(filters) =>
            handleSearchFilters({
              ...filters,
              com_cnpj: filters.com_cnpj.replace(/[^\d]/g, ""),
            })
          }
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            handleValueMask(component.value, "cpf_cnpj") as string
          }
        />
        <Column
          width={"150px"}
          order={pagination.order}
          caption="Tipo"
          dataField={"com_type"}
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
              value: "creator",
              label: "Creator",
            },
            {
              value: "owner",
              label: "Owner",
            },
            {
              value: "maintainer",
              label: "Maintainer",
            },
          ]}
          ValueComponent={(component) => (
            component.value.charAt(0).toUpperCase() + component.value.slice(1)
          )}
        />
        <Column
          width={"90px"}
          order={pagination.order}
          caption="Status"
          dataField={"com_approval_status"}
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
              value: "approved",
              label: "Aprovado",
            },
          ]}
          ValueComponent={(component) => (
            component.value === "pending" 
              ? 'Pendente'
              : 'Aprovado'
          )}
        />
        <ActionsColumn
          dataField={"com_id"}
          actions={["approve"]}
          approveData={handleIsOpenApproveModal}
          displayButtonRules={{
            approve: {
              field: "com_approval_status",
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
        textContent="Tem certeza que ele deseja aprovar essa empresa?"
      />

      <PageLoading isLoading={isLoading || isLoadingApprove} />

    </Box>
  );
}
