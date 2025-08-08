'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import PageTitle from '@app/components/ui/page-title';
import { useParams } from 'next/navigation';
import BackButton from '@app/components/ui/back-button';
import NewRecordButton from '@app/components/ui/new-record-button';
import AddMessagesModal from '../_components/addMessagesModal';
import PageLoading from '@app/components/ui/page-loding';
import Table from '@app/components/Table';
import Column from '@app/components/Table/Column';
import moment from 'moment';
import useAssetsDetailController from '@app/hooks/assetsMaintainer/useAssetsDetailController';
import useBaseAssetsDetailController from '@app/hooks/assets/useBaseAssetsDetailController';
import ActionsColumn from '@app/components/ActionsColumn';

export default function AssetsDetailPage() {
  const params = useParams() as { id: string };

  const baseAssetsDetailController = useBaseAssetsDetailController(Number(params.id));

  const { 
    isLoading: isLoadingMessages,
    TableData: messagesTableData,
    pagination,
    handleSearchFilters,
    hashscanLink: messageHashscanLink,
  } = baseAssetsDetailController;

  const { 
    formMethods,
    handleIsOpenAddMessagesModal,
    isOpenAddMessagesModal,
    isLoadingAddMessages,
    handleAddMessagesModal
  } = useAssetsDetailController(baseAssetsDetailController);

  return (
    <Box>
      <Box mb={"60px"}>
        <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Flex flex="1" minWidth="200px">
            <PageTitle> Histórico de mensagens</PageTitle>
          </Flex>
          <Flex
            justifyContent="flex-end"
            flex="1"
            minWidth="200px"
          >
            <NewRecordButton 
              handleClick={() => {
                formMethods.reset();
                handleIsOpenAddMessagesModal();
              }} 
            >
              <Text
                fontSize={{ base: "18px", mdDown: "14px" }}
                lineHeight={"23px"}
                letterSpacing={"0.5px"}
              >
                Adicionar mensagem
              </Text>
            </NewRecordButton>
          </Flex>
        </Flex>

        <Table
          dataSource={messagesTableData.list ?? []}
          keyExpr="ame_id"
          pagination={pagination}
          colSpan={6}
        >
          <Column
            order={pagination.order}
            caption="Criado em"
            dataField={"ame_created_at"}
            inputType={"date"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) =>
              moment(component.value).format("DD/MM/YYYY HH:mm")
            }
          />
          <Column
            minW={'500px'}
            order={pagination.order}
            caption="Mensagem"
            dataField={"ame_message"}
            handleSearchFilters={handleSearchFilters}
            handleOrder={pagination.handleOrder}
            ValueComponent={(component) =>
              <Text whiteSpace="pre-wrap" mt={'5px'} mb={'5px'}>
                {component.value}
              </Text>
            }
          />
          <ActionsColumn
            dataField={"ame_id"}
            actions={["hashscanLink"]}
            hashscanLinkData={(id) => messageHashscanLink(id)}
          />
        </Table>
      </Box>

      <Flex>
        <Box w={'192px'}>
          <BackButton />
        </Box>
      </Flex>

      <AddMessagesModal
        isOpen={isOpenAddMessagesModal}
        handleModal={handleIsOpenAddMessagesModal}
        formMethods={formMethods}
        isLoading={isLoadingAddMessages}
        handleAddMessagesModal={handleAddMessagesModal}
      />

      <PageLoading isLoading={isLoadingAddMessages || isLoadingMessages} />
    </Box>
  );
}