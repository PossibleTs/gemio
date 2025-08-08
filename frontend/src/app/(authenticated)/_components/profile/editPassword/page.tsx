'use client';

import BaseInput from "@app/components/ui/base-input";
import CancellButton from "@app/components/ui/cancell-button";
import { Field } from "@app/components/ui/field";
import Label from "@app/components/ui/label";
import PageLoading from "@app/components/ui/page-loding";
import PageTitle from "@app/components/ui/page-title";
import SaveButton from "@app/components/ui/save-button";
import constants from "@app/constants";
import useEditPasswordController from "@app/hooks/profile/useEditPasswordController";
import { Box, Flex } from "@chakra-ui/react";

export default function EditPasswordPage() {

  const {
    isLoading,
    handleEditPassword,
    formRef,
    formMethods
  } = useEditPasswordController()

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Alterar senha</PageTitle>
        </Flex>
      </Flex>

      <Box mb={"60px"}>
        <form ref={formRef} onSubmit={formMethods.handleSubmit(handleEditPassword)}>
          <Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.profilePassword.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.usr_password}
                  errorText={formMethods.formState.errors.usr_password?.message ?? ''}
                >
                  <BaseInput
                    {...formMethods.register('usr_password')}
                    type="password"
                    placeholder={constants.formConstant.profilePassword.placeholder}
                  />
                </Field>
            </Box>
          </Box>
          <Box>
            <Box mb={'18px'} width="250px">
              <Label labelText={constants.formConstant.profileConfirmPassword.label} required={true} />
                <Field
                  invalid={!!formMethods.formState.errors.usr_confirm_password}
                  errorText={formMethods.formState.errors.usr_confirm_password?.message ?? ''}
                >
                  <BaseInput
                    {...formMethods.register('usr_confirm_password')}
                    type="password"
                    placeholder={constants.formConstant.profileConfirmPassword.placeholder}
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
              textButton={"Alterar"}
            />
          </Flex>
        </Box>
      </Flex>

      <PageLoading isLoading={isLoading}/>
    </Box>
  )
}