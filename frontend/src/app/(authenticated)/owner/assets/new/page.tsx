'use client';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Field } from '@app/components/ui/field';
import Label from '@app/components/ui/label';
import BaseInput from '@app/components/ui/base-input';
import CancellButton from '@app/components/ui/cancell-button';
import SaveButton from '@app/components/ui/save-button';
import constants from "@app/constants";
import PageTitle from '@app/components/ui/page-title';
import FormSectionTitle from '@app/components/ui/form-section-title';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import InputDatePicker from '@app/components/ui/input-date-picker';
import useNewAssetController from '@app/hooks/assetsOwner/useNewAssetController';
import PageLoading from '@app/components/ui/page-loding';
import SelectSearch from '@app/components/ui/select-search';

export default function CreateForm() {
  const { 
    isLoading, 
    formMethods, 
    handleNewAsset,
    formRef,
    isLoadingCollection,
    selectOptions
  } = useNewAssetController();

  return (
    <Box>
      <Flex flex="1" minWidth="200px">
        <PageTitle>Novo equipamento</PageTitle>
      </Flex>

      <form ref={formRef} onSubmit={formMethods.handleSubmit(handleNewAsset)}>
        <>
          <FormSectionTitle>Informações básicas</FormSectionTitle>
          <Box mb={"60px"}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }}
              gap={4}
              maxW={'1440px'}
            >
              <Box mb={'18px'} width="100%">
                <Label
                  labelText={constants.formConstant.collection.label}
                  required={true}
                />
                <Field
                  invalid={!!formMethods.formState.errors.ass_col_id?.message}
                  errorText={formMethods.formState.errors.ass_col_id?.message ?? ''}
                >
                  <SelectSearch
                    options={selectOptions}
                    placeholder={constants.formConstant.collection.placeholder}
                    value={selectOptions.find(
                      (option) => option.value === (formMethods.watch('ass_col_id')?.toString() ?? '' )
                    )}
                    onChange={(option) => {
                      formMethods.setValue('ass_col_id', Number(option?.value) ?? '', {
                        shouldValidate: true,
                        shouldTouch: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.name.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_name}
                  errorText={formMethods.formState.errors.ass_name?.message ?? ''}
                >
                  <BaseInput
                    fullWidthOnly
                    {...formMethods.register('ass_name')}
                    type="text"
                    placeholder={constants.formConstant.name.placeholder}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.type.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_machine_type}
                  errorText={formMethods.formState.errors.ass_machine_type?.message ?? ''}
                >
                  <BaseInput
                    fullWidthOnly
                    {...formMethods.register('ass_machine_type')}
                    type="text"
                    placeholder={constants.formConstant.type.placeholder}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.serialNumber.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_serial_number}
                  errorText={formMethods.formState.errors.ass_serial_number?.message ?? ''}
                >
                  <BaseInput
                    fullWidthOnly
                    {...formMethods.register('ass_serial_number')}
                    type="text"
                    placeholder={constants.formConstant.serialNumber.placeholder}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.manufacturer.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_manufacturer}
                  errorText={formMethods.formState.errors.ass_manufacturer?.message ?? ''}
                >
                  <BaseInput
                    fullWidthOnly
                    {...formMethods.register('ass_manufacturer')}
                    type="text"
                    placeholder={constants.formConstant.manufacturer.placeholder}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.model.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_model}
                  errorText={formMethods.formState.errors.ass_model?.message ?? ''}
                >
                  <BaseInput
                    fullWidthOnly
                    {...formMethods.register('ass_model')}
                    type="text"
                    placeholder={constants.formConstant.model.placeholder}
                  />
                </Field>
              </Box>

              <Box mb={'18px'} width="100%">
                <Label labelText={constants.formConstant.manufactureYear.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.ass_manufacture_year}
                  errorText={formMethods.formState.errors.ass_manufacture_year?.message ?? ''}
                >
                  <Controller
                    control={formMethods.control}
                    name="ass_manufacture_year"
                    render={({ field }) => ( 
                      <DatePicker
                        onlyYearPicker
                        className="custom-calendar"
                        containerClassName='custom-container'
                        value={field.value ? new Date(Number(field.value), 0) : null}
                        onChange={(date) => {
                          const selectedYear = date?.year?.toString() ?? "";
                          field.onChange(selectedYear);
                        }}
                        render={(value, openCalendar) => (
                          <InputDatePicker
                            openCalendar={openCalendar}
                            value={typeof value === "string" ? value : value[0]}
                            placeholder={constants.formConstant.manufactureYear.placeholder}
                          />
                        )}
                      />
                    )}
                  />
                </Field>
              </Box>
            </Grid>
          </Box>
        </>
      </form>

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

      <PageLoading isLoading={isLoadingCollection} />
    </Box>
  )
}