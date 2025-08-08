'use client';

import BaseInput from "@app/components/ui/base-input";
import CancellButton from "@app/components/ui/cancell-button";
import { Field } from "@app/components/ui/field";
import Label from "@app/components/ui/label";
import PageLoading from "@app/components/ui/page-loding";
import PageTitle from "@app/components/ui/page-title";
import SaveButton from "@app/components/ui/save-button";
import constants from "@app/constants";
import useEditProfileController from "@app/hooks/profile/useEditProfileController";
import { Box, Flex } from "@chakra-ui/react";

export default function EditProfilePage() {

  const {
    isLoading,
    formRef,
    handleEditProfile,
    formMethods
  } = useEditProfileController() 

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Editar perfil</PageTitle>
        </Flex>
      </Flex>

      <Box mb={"60px"}>
        <form ref={formRef} onSubmit={formMethods.handleSubmit(handleEditProfile)}>
          <Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.name.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.usr_name}
                  errorText={formMethods.formState.errors.usr_name?.message ?? ''}
                >
                  <BaseInput
                    {...formMethods.register('usr_name')}
                    type="text"
                    placeholder={constants.formConstant.name.placeholder}
                  />
                </Field>
            </Box>
          </Box>
          <Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.email.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.usr_email}
                  errorText={formMethods.formState.errors.usr_email?.message ?? ''}
                >
                  <BaseInput
                    {...formMethods.register('usr_email')}
                    type="text"
                    placeholder={constants.formConstant.email.placeholder}
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
              isLoading={false} 
              disableSubmit={isLoading}
              textButton={"Editar"}
            />
          </Flex>
        </Box>
      </Flex>

      <PageLoading isLoading={isLoading} />
    </Box>
  )
}