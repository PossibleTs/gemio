/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ReactNode } from "react";
import { Box, Table as ChakraTable, TableRowProps, Text } from "@chakra-ui/react";

import constants from "@app/constants";

import LimitPage from "../ui/limit-page";
import ColumnsValues from "./ColumnsValues";
import Pagination, { PaginationProps } from "../ui/pagination";
import TableHeader from "../ui/table-header";

type TableProps = {
  dataSource: any[];
  keyExpr: string;
  colSpan?: number;
  children: ReactNode;
  pagination?: { handleLimitPage: (limit: number) => void } & PaginationProps;
  renderHeaderBtn?: ReactNode;
  disableColumnsHeader?: boolean;
  disableScroll?: boolean;
  minimumWidth?: boolean;
  disableHeader?: boolean;
  disableBordersContainer?: boolean;
  tableLayout?: "auto" | "fixed" | "unset";
  className?: string;
  renderFooter?: ReactNode;
  rowProps?: TableRowProps;
};
/**
 *
 * @param props
 * @param props.dataSource - Array de dados que será usado como fonte para renderização.
 * @param props.keyExpr - Identificador único de cada item na tabela.
 * @param props.colSpan - Número de colunas que o componente deve abranger (Utilizado na mensagem "Nenhum registro encontrado").
 * @param props.children - Elementos filhos do componente.
 * @param props.pagination - Objeto opcional para lidar com paginação.
 * @param props.renderHeaderBtn - Elemento React opcional para renderizar botões ou componentes acima da tabela.
 * @param props.disableHeader - Booleano opcional para desabilitar o cabeçalho da tabela.
 * @param props.disableColumnsHeader - Booleano opcional para desabilitar as colunas do cabeçalho da tabela.
 * @param props.disableScroll - Booleano opcional para desabilitar o scroll da tabela.
 * @param props.minimumWidth - Booleano opcional para deixar a tabela ocupando o mínimo do espaço.
 * @param props.disableBordersContainer - Booleano opcional para habilitar/desabilitar as bordas do container da tabela.
 * @param props.rowProps - Define propriedades de estilo para linhas.
 * @returns JSX.Element - Elemento React renderizado da tabela.
 */
const Table = (props: TableProps) => {
  const {
    dataSource,
    colSpan,
    children,
    pagination,
    renderHeaderBtn,
    disableHeader = false,
    disableColumnsHeader = false,
    disableScroll = false,
    minimumWidth = false,
    disableBordersContainer = false,
    tableLayout = "unset",
    className = "",
    renderFooter,
    rowProps
  } = props;

  return (
    <Box>
      {!disableHeader && (
        <TableHeader>
          {pagination?.limitPages ? (
            <Box>
              <LimitPage
                limit={`${pagination.limitPages ?? constants.pagination.LIMIT_PAG}`}
                handleLimitPage={pagination.handleLimitPage}
              />
            </Box>
          ) : null}
          <Box ml={"auto"}>{renderHeaderBtn}</Box>
        </TableHeader>
      )}

      <Box
        border={
          disableBordersContainer
            ? "none"
            : "1px solid var(--chakra-colors-border)"
        }
        borderRadius="8px"
        boxShadow={constants.shadows.tableShadow}
        overflowX={
          !disableScroll ? "scroll" : { base: "scroll", sm: "initial" }
        }
        width={minimumWidth ? "auto" : "100%"}
        maxW={minimumWidth ? "fit-content" : "100%"}
      >
        <ChakraTable.Root
          showColumnBorder
          borderCollapse={"collapse"}
          tableLayout={tableLayout}
          className={className}
        >
          {!disableColumnsHeader && (
            <ChakraTable.Header>
              <ChakraTable.Row fontSize={"16px"} userSelect={"none"}>{children}</ChakraTable.Row>
            </ChakraTable.Header>
          )}

          <ChakraTable.Body>
            <ColumnsValues rowProps={rowProps} dataSource={dataSource} columns={children} />
          </ChakraTable.Body>

          {dataSource.length < 1 ? (
            <ChakraTable.Footer width={"100%"}>
              <ChakraTable.Row>
                <ChakraTable.Cell colSpan={colSpan} textAlign={"center"}>
                  <Text fontSize={"18px"} py={'12px'}>Nenhum registro encontrado!</Text>
                </ChakraTable.Cell>
              </ChakraTable.Row>
            </ChakraTable.Footer>
          ) : null}

          {dataSource.length > 0 && renderFooter}
        </ChakraTable.Root>
      </Box>

      {pagination && (
        <Box
          borderBottomColor={"line_grey"}
          borderBottomWidth={"1px"}
          w={"50%"}
          m={"auto"}
        >
          <Pagination
            handleNextPage={pagination.handleNextPage}
            handlePreviousPage={pagination.handlePreviousPage}
            handleToPage={pagination.handleToPage}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        </Box>
      )}
    </Box>
  );
};

export default Table;
