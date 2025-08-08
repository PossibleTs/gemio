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
import SelectSearch from "@app/components/ui/select-search";
import { Button } from "@app/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { AddPermissionDto } from "@app/hooks/assetsOwner/useAssetsDetailController";

type SelectOption = {
  label: string;
  value: string;
};

type AddPermissionModalProps = {
  isOpen: boolean;
  handleModal: () => void;
  selectOptions: SelectOption[];
  formMethods: UseFormReturn<AddPermissionDto>;
  isLoading: boolean;
  handleAddPermissionModal: (data: AddPermissionDto) => Promise<void>;
};

const AddPermissionModal = (props: AddPermissionModalProps) => {
  const { 
    isOpen, 
    handleModal, 
    selectOptions,
    formMethods,
    isLoading,
    handleAddPermissionModal 
  } = props;

  return (
    <Box>
      <DialogRoot open={isOpen} onOpenChange={handleModal}>
        <DialogContent w={'100vw'} mt={'50px'} mx={'10px'}>
          <DialogHeader p={'20px'}>
            <DialogTitle>
              <Text fontSize={"18px"} lineHeight={"23px"} letterSpacing={"0.5px"}>
                Adicionar permissão
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody px={'20px'} py={'10px'}>
            <Box mb={'18px'} width="100%">
              <Label
                labelText={"Mantainer"}
                required={true}
              />
              <Field
                invalid={!!formMethods.formState.errors.com_id?.message}
                errorText={formMethods.formState.errors.com_id?.message ?? ''}
              >
                <SelectSearch
                  options={selectOptions}
                  placeholder={"Selecione o mantainer"}
                  value={selectOptions.find(
                    (option) => option.value === formMethods.watch('com_id')
                  )}
                  onChange={(option) => {
                    formMethods.setValue('com_id', option?.value ?? '', {
                      shouldValidate: true,
                      shouldTouch: true,
                      shouldDirty: true,
                    });
                  }}
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
              onClick={formMethods.handleSubmit(handleAddPermissionModal)}
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

export default AddPermissionModal;
