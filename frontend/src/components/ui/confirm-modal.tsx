import { DialogBody, Text } from "@chakra-ui/react";

import {
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";

type ConfirmActionModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  handleModal: () => void;
  handleSubmit: () => void;

  title: string;
  textContent: string;
  subTextContent?: string;
};
const ConfirmActionModal = (props: ConfirmActionModalProps) => {
  const {
    isOpen = false,
    handleModal,
    handleSubmit,
    isLoading,
    title,
    textContent,
    subTextContent = "",
  } = props;
  return (
    <DialogRoot open={isOpen} onOpenChange={handleModal}>
      <DialogContent w={'100vw'} mt={'50px'} mx={'10px'}>
        <DialogHeader p={'20px'}>
          <DialogTitle>
            <Text fontSize={"18px"} lineHeight={"23px"} letterSpacing={"0.5px"}>
              {title}
            </Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody px={'20px'} py={'10px'}>
          <Text fontSize={"16px"} lineHeight={"23px"} letterSpacing={"0.5px"}>
            {textContent}
          </Text>
          {subTextContent && (
            <Text
              fontSize={"14px"}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
              mt={"8px"}
            >
              {subTextContent}
            </Text>
          )}
        </DialogBody>
        <DialogFooter p={'20px'}>
          <Button 
            onClick={handleModal} 
            colorScheme="blue"
            variant="outline"
            size="lg"
            px={'20px'}
            borderRadius={"5px"}
          >
            <Text
              fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
              color={"rgba(90, 69, 149)"}
            >
              Cancelar
            </Text>
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            loadingText="Confirmando"
            borderRadius={"5px"}
            colorScheme="blue" 
            px={'20px'}
            size="lg"
            bg={"rgba(90, 69, 149)"}
          >
            <Text 
              fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
            >
              Confirmar
            </Text>
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={handleModal} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmActionModal;
