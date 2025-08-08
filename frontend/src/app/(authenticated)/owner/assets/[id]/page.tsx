'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import PageTitle from '@app/components/ui/page-title';
import Table from '@app/components/Table';
import Column from '@app/components/Table/Column';
import { useParams } from 'next/navigation';
import moment from 'moment';
import BackButton from '@app/components/ui/back-button';
import useAssetsDetailController from '@app/hooks/assetsOwner/useAssetsDetailController';
import ActionsColumn from '@app/components/ActionsColumn';
import ConfirmActionModal from '@app/components/ui/confirm-modal';
import NewRecordButton from '@app/components/ui/new-record-button';
import AddPermissionModal from '../_components/addPermissionModal';
import AlertPermissionModal from '../_components/AlertPermissionModal';
import PageLoading from '@app/components/ui/page-loding';
import useBaseAssetsDetailController from '@app/hooks/assets/useBaseAssetsDetailController';

export default function AssetsDetailPage() {
  const params = useParams() as { id: string };

  const baseAssetsDetailController = useBaseAssetsDetailController(Number(params.id));

  const { 
    pagination: paginationMessages,
    handleSearchFilters: handleSearchFiltersMessages,
    isLoading: isLoadingMessages,
    TableData: messagesTableData,
    hashscanLink: messageHashscanLink,
  } = baseAssetsDetailController;

  const { 
    handleDeletePermission,
    handleIsOpenDeleteModal,
    deleteModalIsOpen,
    isLoadingDelete,
    handleIsOpenAddPermissionModal,
    handleAddPermissionModal,
    isOpenAddPermissionModal,
    permissionTableData,
    isLoadingAddPermission,
    formMethods,
    selectOptions,
    isLoadingPermissions,
    paginationPermissions,
    handleSearchFiltersPermissions,
    isLoadingCompany,
    isOpenAlertPermissionModal,
    handleIsOpenAlertPermissionModal,
    checkPermissionRemoved,
    permissionEndDate,
    hashscanLink
  } = useAssetsDetailController(baseAssetsDetailController);

  return (
    <Box>
      <Box mb={"60px"}>
        <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Flex flex="1" minWidth="200px">
            <PageTitle>
              Histórico de mensagens
            </PageTitle>
          </Flex>
        </Flex>

        <Table
          dataSource={messagesTableData.list ?? []}
          keyExpr="ame_id"
          pagination={paginationMessages}
          colSpan={4}
        >
          <Column
            order={paginationMessages.order}
            caption="Criado em"
            dataField={"ame_created_at"}
            inputType={"date"}
            handleSearchFilters={handleSearchFiltersMessages}
            handleOrder={paginationMessages.handleOrder}
            ValueComponent={(component) =>
              moment(component.value).format("DD/MM/YYYY HH:mm")
            }
          />
          <Column
            w={'200px'}
            order={paginationMessages.order}
            caption="Maintainer"
            dataField={"ame_created_by"}
            handleSearchFilters={(filters) =>
                handleSearchFiltersMessages({ com_name: filters.ame_created_by })
              }
            handleOrder={paginationMessages.handleOrder}
            orderAndFilterField="com_name"
            ValueComponent={(component) =>
              component.value.com_name
            }
          />
          <Column
            minW={'500px'}
            order={paginationMessages.order}
            caption="Mensagem"
            dataField={"ame_message"}
            handleSearchFilters={handleSearchFiltersMessages}
            handleOrder={paginationMessages.handleOrder}
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

      <Box mb={"60px"}>
        <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Flex flex="1" minWidth="200px">
            <PageTitle>Permissões</PageTitle>
          </Flex>
          <Flex
            justifyContent="flex-end"
            flex="1"
            minWidth="200px"
          >
            <NewRecordButton handleClick={() => {
                formMethods.reset();
                handleIsOpenAddPermissionModal();
              }} 
            >
              <Text
                fontSize={{ base: "18px", mdDown: "14px" }}
                lineHeight={"23px"}
                letterSpacing={"0.5px"}
              >
                Adicionar permissão
              </Text>
            </NewRecordButton>
          </Flex>
        </Flex>

        <Table
          dataSource={permissionTableData.list ?? []}
          keyExpr="map_id"
          pagination={paginationPermissions}
          colSpan={5}
        >
          <Column
            width={"100px"}
            order={paginationPermissions.order}
            caption="Id"
            dataField={"map_id"}
            handleSearchFilters={handleSearchFiltersPermissions}
            handleOrder={paginationPermissions.handleOrder}
          />
          <Column
            order={paginationPermissions.order}
            caption="Empresa"
            dataField={"com_company"}
            handleSearchFilters={(filters) =>
              handleSearchFiltersPermissions({ com_name: filters.com_company })
            }
            handleOrder={paginationPermissions.handleOrder}
            orderAndFilterField="com_name"
            ValueComponent={(component) =>
              component.value.com_name
            }
          />
          <Column
            width={"200px"}
            order={paginationPermissions.order}
            caption="Data de inclusão"
            dataField={"map_start_date"}
            inputType={"date"}
            handleSearchFilters={handleSearchFiltersPermissions}
            handleOrder={paginationPermissions.handleOrder}
            ValueComponent={(component) =>
              moment(component.value).format("DD/MM/YYYY HH:mm")
            }
          />
          <Column
            width={"200px"}
            order={paginationPermissions.order}
            caption="Data de remoção"
            dataField={"map_end_date"}
            inputType={"date"}
            handleSearchFilters={handleSearchFiltersPermissions}
            handleOrder={paginationPermissions.handleOrder}
            ValueComponent={(component) =>
              component.value === null 
                ? "--/--/---- --:--" 
                : moment(component.value).format("DD/MM/YYYY HH:mm")
            }
          />
          <ActionsColumn
            dataField={"map_id"}
            actions={["delete", "hashscanLink"]}
            deleteData={(id) => checkPermissionRemoved(id)}
            hashscanLinkData={(id) => hashscanLink(id)}
          />
        </Table>
      </Box>

      <Flex>
        <Box w={'192px'}>
          <BackButton />
        </Box>
      </Flex>

      <ConfirmActionModal
        isLoading={isLoadingDelete}
        isOpen={deleteModalIsOpen}
        handleModal={handleIsOpenDeleteModal}
        handleSubmit={handleDeletePermission}
        title="Confirmar ação"
        textContent="Tem certeza que deseja deletar?"
      />

      <AddPermissionModal
        isOpen={isOpenAddPermissionModal}
        handleModal={handleIsOpenAddPermissionModal}
        selectOptions={selectOptions}
        formMethods={formMethods}
        isLoading={isLoadingAddPermission}
        handleAddPermissionModal={handleAddPermissionModal}
      />

      <AlertPermissionModal
        isOpen={isOpenAlertPermissionModal}
        handleModal={handleIsOpenAlertPermissionModal}
        permissionEndDate={permissionEndDate}
      />

      <PageLoading isLoading={isLoadingDelete || isLoadingAddPermission || isLoadingPermissions || isLoadingCompany || isLoadingMessages} />
    </Box>
  );
}
