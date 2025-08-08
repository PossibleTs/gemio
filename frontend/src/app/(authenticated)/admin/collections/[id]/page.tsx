'use client';
import { Box, Flex } from '@chakra-ui/react';
import useCollectionDetailController from '@app/hooks/collections/useCollectionDetailController';
import PageLoading from '@app/components/ui/page-loding';
import PageTitle from '@app/components/ui/page-title';
import Table from '@app/components/Table';
import Column from '@app/components/Table/Column';
import { useParams } from 'next/navigation';
import moment from 'moment';
import BackButton from '@app/components/ui/back-button';
import HashscanLink from '@app/components/ui/hashscan-link';

export default function CollectionDetailPage() {
  const params = useParams() as { id: string };

  const { 
    dataCollection, 
    isLoadingCollection, 
    isLoadingAssets,
    pagination,
    handleSearchFilters,
    tableData 
  } = useCollectionDetailController(params.id);

  return (
    <Box>
      <Box mb={"60px"}>
        <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Flex flex="1" minWidth="200px">
            <PageTitle>
              {dataCollection?.col_name
                ? `${dataCollection?.col_name} - ${dataCollection?.col_symbol}`
                : ''}{' '}
            </PageTitle>
          </Flex>
        </Flex>

        <Table 
          dataSource={tableData.list ?? []} 
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
            dataField={"ass_nft_serial"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) =>
              <HashscanLink
                value={component.value}
                path={`token/${dataCollection.col_hedera_token_id}/${component.value}`}
              />
            }
          />
          <Column
            order={pagination.order}
            caption="Nome"
            dataField={"col_collection"}
            handleSearchFilters={(filters) =>
              handleSearchFilters({ col_name: filters.col_collection })
            }
            handleOrder={pagination.handleOrder}
            orderAndFilterField="col_name"
            ValueComponent={(component) => component.value.col_name}
          />
          <Column
            order={pagination.order}
            caption="Tipo"
            dataField={"ass_machine_type"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) => component.value}
          />
          <Column
            order={pagination.order}
            caption="Fabricante"
            dataField={"ass_manufacturer"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) => component.value}
          />
          <Column
            order={pagination.order}
            caption="Modelo"
            dataField={"ass_model"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) => component.value}
          />
          <Column
            width={"100px"}
            order={pagination.order}
            caption="Ano"
            dataField={"ass_manufacture_year"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) => component.value}
          />
          <Column 
            width={"100px"}
            order={pagination.order} 
            caption="Serial" 
            dataField={'ass_serial_number'}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder} 
          />
          <Column
            width={"100px"}
            order={pagination.order}
            caption="Tópico"
            dataField={"ass_topic_id"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
             ValueComponent={(component) =>
              <HashscanLink
                value={component.value}
                path={`topic/${component.value}`}
              />
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
          <Column
            order={pagination.order}
            caption="Criado em"
            dataField={"ass_created_at"}
            inputType={"date"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) => (
              moment(component.value.ass_created_at).format("DD/MM/YYYY HH:mm")
            )}
          />
        </Table>
      </Box>

      <Flex>
        <Box w={'192px'}>
          <BackButton />
        </Box>
      </Flex>

      <PageLoading isLoading={isLoadingCollection || isLoadingAssets} />
    </Box>
  );
}
