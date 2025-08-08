'use client';
import { Text } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';
import useCollectionsController from '@app/hooks/collections/useCollectionsController';
import PageLoading from '@app/components/ui/page-loding';
import PageTitle from '@app/components/ui/page-title';
import NewRecordButton from '@app/components/ui/new-record-button';
import Table from "@app/components/Table";
import Column from "@app/components/Table/Column";
import moment from "moment";
import ActionsColumn from '@app/components/ActionsColumn';
import HashscanLink from '@app/components/ui/hashscan-link';

export default function CollectionsPage() {
  const { 
    isLoading, 
    handleDetail,
    pagination,
    handleSearchFilters,
    tableData
  } = useCollectionsController();

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Coleções</PageTitle>
        </Flex>
        <Flex
          justifyContent="flex-end"
          flex="1"
          minWidth="200px"
        >
          <NewRecordButton src="/admin/collections/new">
            <Text
              fontSize={{ base: "18px", mdDown: "14px" }}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
            >
              Nova coleção
            </Text>
          </NewRecordButton>
        </Flex>
      </Flex>

      <Table
        dataSource={tableData.list ?? []}
        keyExpr="col_id"
        pagination={pagination}
        colSpan={7}
      >
        <Column
          width={"150px"}
          order={pagination.order}
          caption="Token Id"
          dataField={"col_hedera_token_id"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            <HashscanLink
              value={component.value}
              path={`token/${component.value}`}
            />
          }
        />
        <Column
          order={pagination.order}
          caption="Nome"
          dataField={"col_name"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          maxW={'500px'}
          minW={'400px'}
          order={pagination.order}
          caption="Descrição"
          dataField={"col_description"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            <Text whiteSpace="pre-wrap" mt={'5px'} mb={'5px'}>
              {component.value}
            </Text>
          }
        />
        <Column
          width={"100px"}
          order={pagination.order}
          caption="Simbolo"
          dataField={"col_symbol"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
        />
        <Column
          width={"150px"}
          order={pagination.order}
          caption="Criado em"
          dataField={"col_created_at"}
          inputType={"date"}
          handleSearchFilters={handleSearchFilters}
          handleOrder={pagination.handleOrder}
          ValueComponent={(component) =>
            moment(component.value).format("DD/MM/YYYY HH:mm")
          }
        />
        <Column
          caption="Status"
          order={pagination.order}
          dataField={"col_status"}
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
              value: "active",
              label: "Ativo",
            },
          ]}
          ValueComponent={(component) => (
            component.value === "pending" 
              ? 'Pendente'
              : 'Ativo'
          )}
        />
        <ActionsColumn
          dataField={"col_id"}
          actions={["details"]}
          detailsData={handleDetail}
        />
      </Table>

      <PageLoading isLoading={isLoading} />
    </Box>
  );
}
