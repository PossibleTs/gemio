'use client';
import { Box, Flex } from '@chakra-ui/react';
import useNewCollectionController from '@app/hooks/collections/useNewCollectionController';
import { Controller } from 'react-hook-form';
import { Field } from '@app/components/ui/field';
import Label from '@app/components/ui/label';
import BaseInput from '@app/components/ui/base-input';
import CancellButton from '@app/components/ui/cancell-button';
import SaveButton from '@app/components/ui/save-button';
import constants from "@app/constants";
import PageTitle from '@app/components/ui/page-title';
import BaseTextarea from '@app/components/ui/base-textarea';

export default function CreateForm() {
  const { isLoading, formMethods, handleNewCollection, formRef } =
    useNewCollectionController();

  return (
    <Box>
      <Flex flex="1" minWidth="200px">
        <PageTitle>Nova coleção</PageTitle>
      </Flex>
      <Box mb={"60px"}>
        <form ref={formRef} onSubmit={formMethods.handleSubmit(handleNewCollection)}>
          <Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.name.label} required={true} />
              <Controller
                name="name"
                control={formMethods.control}
                render={({ field: { value, onBlur } }) => (
                  <Field
                    invalid={!!formMethods.formState.errors.name}
                    errorText={formMethods.formState.errors.name?.message ?? ''}
                  >
                    <BaseInput
                      {...formMethods.register('name')}
                      type="text"
                      value={value || ''}
                      onBlur={onBlur}
                      placeholder={constants.formConstant.name.placeholder}
                    />
                  </Field>
                )}
              />
            </Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.symbol.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.symbol}
                  errorText={formMethods.formState.errors.symbol?.message ?? ''}
                >
                  <BaseInput
                    {...formMethods.register('symbol')}
                    type="text"
                    placeholder={constants.formConstant.symbol.placeholder}
                  />
                </Field>
            </Box>
            <Box mb={'18px'} width={{base: "250px", sm: "377px"}}>
              <Label
                labelText={"Descrição"}
                required={true}
              />
              <Field
                invalid={!!formMethods.formState.errors.description?.message}
                errorText={formMethods.formState.errors.description?.message ?? ''}
              >
                <BaseTextarea
                  fullWidthOnly
                  {...formMethods.register('description')}
                  placeholder={"Digite a descrição"}
                />
              </Field>
            </Box>
          </Box>
        </form>
      </Box>

      <Flex>
        <Box>
          <Flex gap={constants.forms.SUBMIT_BUTTONS_GAP}>
            <CancellButton />
            <SaveButton 
              onClick={() => formRef.current?.requestSubmit()}
              isLoading={isLoading} 
              disableSubmit={true}
            />
          </Flex>
        </Box>
      </Flex>

      {/* <PageLoading isLoading={isLoading} /> */}
    </Box>
  );
}