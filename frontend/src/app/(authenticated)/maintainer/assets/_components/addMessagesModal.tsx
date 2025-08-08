import { Box, Text } from "@chakra-ui/react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@app/components/ui/dialog";
import Label from "@app/components/ui/label";
import { Field } from "@app/components/ui/field";
import { Button } from "@app/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import BaseTextarea from "@app/components/ui/base-textarea";
import { AddMessagesDto } from "@app/hooks/assetsMaintainer/useAssetsDetailController";

type AddMessagesModalProps = {
  isOpen: boolean;
  handleModal: () => void;
  formMethods: UseFormReturn<AddMessagesDto>;
  isLoading: boolean;
  handleAddMessagesModal: (data: AddMessagesDto) => Promise<void>;
};

const AddMessagesModal = (props: AddMessagesModalProps) => {
  const { 
    isOpen, 
    handleModal, 
    formMethods,
    isLoading,
    handleAddMessagesModal 
  } = props;

  return (
    <Box>
      <DialogRoot open={isOpen} onOpenChange={handleModal}>
        <DialogContent w={'100vw'} mt={'50px'} mx={'10px'}>
          <DialogHeader p={'20px'}>
            <DialogTitle>
              <Text fontSize={"18px"} lineHeight={"23px"} letterSpacing={"0.5px"}>
                Adicionar mensagem
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody px={'20px'} py={'10px'}>
            <Box mb={'18px'} width="100%">
              <Label
                labelText={"Mensagem"}
                required={true}
              />
              <Field
                invalid={!!formMethods.formState.errors.ame_message?.message}
                errorText={formMethods.formState.errors.ame_message?.message ?? ''}
              >
                <BaseTextarea
                  fullWidthOnly
                  {...formMethods.register('ame_message')}
                  placeholder={"Digite a Mensagem"}
                />
              </Field>
            </Box>
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
              onClick={formMethods.handleSubmit(handleAddMessagesModal)}
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
                Adicionar
              </Text>
            </Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={handleModal} />
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};

export default AddMessagesModal;