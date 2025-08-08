import { ListPaginationDto } from "@app/types/Request";
import { Box, Flex, Text } from "@chakra-ui/react";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

export type PaginationProps = Partial<ListPaginationDto> & {
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleToPage: (page: number) => void;
};
const Pagination = (props: PaginationProps) => {
  const {
    page = 1,
    totalPages = 1,
    handleNextPage,
    handlePreviousPage,
    handleToPage,
  } = props;

  const pageArr = totalPages ? generatePagesArr(totalPages, page ?? 1) : [];

  return (
    <Flex gap={[8, 16]} p={[4, 8]} justifyContent="center" alignItems="center">
      <Box onClick={handlePreviousPage} cursor={"pointer"}>
        <Flex alignItems={"center"}>
          <HiArrowLongLeft
            size={22}
            color={"#CBCBCB"}
            fontSize={"14px"}
          />
          <Text
            ml={"9px"}
            fontSize={"14px"}
            color={'text_primary'}
          >
            Voltar
          </Text>
        </Flex>
      </Box>
      <Flex gap={[2, 4]} alignItems="center">
        {page && page > 5 ? (
          <>
            <Box cursor={"pointer"} onClick={() => handleToPage(1)}>
              <Text
                color={1 === page ? "darkest" : "text_primary"}
                fontSize={"14px"}
              >
                1
              </Text>
            </Box>
            <Box>
              <Text
                color={"darkest"}
                fontSize={"14px"}
              >
                ...
              </Text>
            </Box>
          </>
        ) : null}
        {pageArr.map((pageNumber) => (
          <Box
            key={pageNumber}
            cursor="pointer"
            onClick={() => handleToPage(pageNumber)}
          >
            <Text
              color={pageNumber === page ? "darkest" : "text_primary"}
              scale={pageNumber === page ? 1.12 : 1}
              fontSize={"14px"}
            >
              {pageNumber}
            </Text>
          </Box>
        ))}
        {page && Number(totalPages) > 7 && Number(totalPages) - page > 2 ? (
          <>
            <Box>
              <Text
                color={"darkest"}
                fontSize={"14px"}
              >
                ...
              </Text>
            </Box>
            <Box cursor={"pointer"} onClick={() => handleToPage(Number(totalPages))}>
              <Text
                color={totalPages === page ? "darkest" : "text_primary"}
                fontSize={"14px"}
              >
                {totalPages}
              </Text>
            </Box>
          </>
        ) : null}
      </Flex>
      <Box onClick={handleNextPage} cursor={"pointer"}>
        <Flex alignItems={"center"}>
          <Text
            mr={"9px"}
            fontSize={"14px"}
            color={'text_primary'}
          >
            Próxima
          </Text>
          <HiArrowLongRight
            size={22}
            color={"#CBCBCB"}
          />
        </Flex>
      </Box>
    </Flex>
  );
};

const generatePagesArr = (amount: number, pageActive: number) => {
  const pagesArr = [];

  for (let i = 1; i <= amount; i++) {
    pagesArr.push(i);
  }

  const index = pagesArr.indexOf(pageActive);

  // Verifica se a página ativa está dentro do intervalo válido
  if (index !== -1) {
    const halfWindowSize = 2; // Metade do tamanho da "janela" ao redor da página ativa
    let startIndex = Math.max(0, index - halfWindowSize);
    let endIndex = Math.min(pagesArr.length - 1, index + halfWindowSize);

    // Ajusta o índice inicial ou final se necessário para garantir que sempre haja 5 itens
    while (endIndex - startIndex + 1 < 7) {
      if (startIndex > 0) {
        startIndex--;
      } else if (endIndex < pagesArr.length - 1) {
        endIndex++;
      } else {
        break; // Não é possível adicionar mais itens, interrompe o loop
      }
    }

    // Retorna o array com os 5 itens
    return pagesArr.slice(startIndex, endIndex + 1);
  } else {
    // Se a página ativa não estiver no array, retorna um array vazio
    return [];
  }
};

export default Pagination;
