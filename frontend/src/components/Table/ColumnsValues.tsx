/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Children, ComponentType, ReactNode } from "react";
import { Table as ChakraTable, Flex, TableColumnProps, TableRowProps } from "@chakra-ui/react";

import { Actions } from "../ActionsColumn";
import EditButton from "../ui/edit-button";
import DeleteButton from "../ui/delete-button";
import ApproveButton from "../ui/approve-button";
import DetailsButton from "../ui/details-button";
import HashscanLinkButton from "../ui/hashscan-link-button";

type ColumnsValuesProps = {
  dataSource: any[];
  columns: ReactNode;
  rowProps?: TableRowProps;
};

const ColumnsValues = (props: ColumnsValuesProps) => {
  const { dataSource, columns, rowProps } = props;

  return dataSource.map((data, index) => {
    const columnsProps = Children.map(columns, (child) => {
      if (React.isValidElement(child)) {
        return child.props;
      }
      return null;
    });

    return (
      <React.Fragment key={index}>
        <ChakraTable.Row
          height="56px"
          bgColor={customStriped(index)}
          {...rowProps}
        >
          {columnsProps?.map((col, colIndex) => {
            const column = col as {
              dataField: string;
              itemId: string;
              displayButtonRules?: {
                [K in Actions]?: {
                  field: string;
                  matchRule: (data: any) => boolean;
                };
              };
              ValueComponent?: ComponentType<{ value: any }>;
              editData?: VoidFunction;
              deleteData?: VoidFunction;
              hashscanLinkData?: VoidFunction;
              approveData?: VoidFunction;
              detailsData?: VoidFunction;
              actions: Actions[];
            } & TableColumnProps;

            const dataField = column.dataField;
            let cellValue = data[dataField];

            if (column.itemId) {
              cellValue = {
                itemId: data[column.itemId],
                dataObj: data[dataField],
              };
            }

            cellValue = formattedValue(cellValue);
            const ValueComponent = column.ValueComponent;

            let actions = column.actions;
            const isActionColumn = !!actions?.length;

            const displayButtonRules = column?.displayButtonRules;
            if (displayButtonRules && Object.keys(displayButtonRules).length) {
              const keys = Object.keys(displayButtonRules) as Actions[];

              keys.forEach((key) => {
                const validationOptions = displayButtonRules[key];
                if (
                  validationOptions &&
                  data[validationOptions.field] &&
                  validationOptions.matchRule(data[validationOptions.field])
                ) {
                  actions = actions.filter((action) => action !== key);
                }
              });
            }

            const editData = column.editData;
            const deleteData = column.deleteData;
            const hashscanLinkData = column.hashscanLinkData;
            const approveData = column.approveData;
            const detailsData = column.detailsData;

            return (
              <ChakraTable.Cell
                width={column.width}
                position={column.position}
                textWrap={"nowrap"}
                px={"20px"}
                key={colIndex}
              >
                <CellValue
                  cellValue={cellValue}
                  ValueComponent={ValueComponent}
                  editData={editData}
                  deleteData={deleteData}
                  hashscanLinkData={hashscanLinkData}
                  approveData={approveData}
                  detailsData={detailsData}
                  actions={actions}
                  isActionColumn={isActionColumn}
                />
              </ChakraTable.Cell>
            );
          })}
        </ChakraTable.Row>
      </React.Fragment>
    );
  });
};

type CellValueProps = {
  ValueComponent?: ComponentType<{ value: string }>;
  cellValue: any;
  actions: Actions[];
  column?: (id: number) => void;
  editData?: (id: number) => void;
  deleteData?: (id: number) => void;
  hashscanLinkData?: (id: number) => void;
  approveData?: (id: number) => void;
  detailsData?: (id: number) => void;
  isActionColumn: boolean;
};

const CellValue = (props: CellValueProps) => {
  const {
    cellValue,
    ValueComponent,
    actions = [],
    editData,
    deleteData,
    hashscanLinkData,
    approveData,
    detailsData,
    isActionColumn,
  } = props;

  const hasActions = actions.length > 0;
  if (hasActions) {
    const isEdit = actions?.includes("edit");
    const isDelete = actions?.includes("delete");
    const isHashscanLink = actions?.includes("hashscanLink");
    const isApprove = actions?.includes("approve");
    const isDetails = actions?.includes("details");

    const buttons = [];

    const handleEditData = () => {
      if (!!editData) {
        editData(cellValue);
      }
    };

    const handleDeleteData = () => {
      if (!!deleteData) {
        deleteData(cellValue);
      }
    };

    const handleHashscanLinkData = () => {
      if (!!hashscanLinkData) {
        hashscanLinkData(cellValue);
      }
    };

    const handleApproveData = () => {
      if (!!approveData) {
        approveData(cellValue);
      }
    };
    
    const handleDetailsData = () => {
      if (!!detailsData) {
        detailsData(cellValue);
      }
    };

    if (isEdit)
      buttons.push(
        <EditButton handleEditData={handleEditData} key={"editButton"} />
      );

    if (isHashscanLink)
      buttons.push(
        <HashscanLinkButton
          handleHashscanLinkData={handleHashscanLinkData}
          key={"hashscanLinkButton"}
        />
      );

    if (isDelete)
      buttons.push(
        <DeleteButton
          handleDeleteData={handleDeleteData}
          key={"deleteButton"}
        />
      );

    if (isApprove)
      buttons.push(
        <ApproveButton
          handleApproveData={handleApproveData}
          key={"approveButton"}
        />
      );

    if (isDetails)
      buttons.push(
        <DetailsButton
          handleDetailsData={handleDetailsData}
          key={"detailsButton"}
        />
      );

    if (buttons.length) {
      return (
        <ButtonContainer>
          {buttons.map((btnComponent) => btnComponent)}
        </ButtonContainer>
      );
    }
  }

  if (!hasActions && isActionColumn) return " ";

  if (ValueComponent) {
    return <ValueComponent value={cellValue} />;
  }

  return cellValue;
};

const customStriped = (index: number) => (index % 2 === 0 ? "light_grey" : "");

const formattedValue = (cellValue: any) => {
  if (
    typeof cellValue === "object" ||
    typeof cellValue === "number" ||
    cellValue
  ) {
    return cellValue;
  } else {
    return "";
  }
};

const ButtonContainer = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <Flex gap={"24px"} justifyContent={"center"}>
      {children}
    </Flex>
  );
};

export default ColumnsValues;
