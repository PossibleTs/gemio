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
import { Button } from "@app/components/ui/button";
import moment from "moment";


type AlertPermissionModalProps = {
  isOpen: boolean;
  handleModal: () => void;
  permissionEndDate: string
};

const AlertPermissionModal = (props: AlertPermissionModalProps) => {
  const { 
    isOpen, 
    handleModal, 
    permissionEndDate
  } = props;

  return (
    <Box>
      <DialogRoot open={isOpen} onOpenChange={handleModal}>
        <DialogContent w={'100vw'} mt={'50px'} mx={'10px'}>
          <DialogHeader p={'20px'}>
            <DialogTitle>
              <Text fontSize={"18px"} lineHeight={"23px"} letterSpacing={"0.5px"}>
                Permissão removida
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody px={'20px'} py={'10px'}>
            <Text>
              Esta permissão foi removida em {moment(permissionEndDate).format("DD/MM/YYYY")} às {moment(permissionEndDate).format("HH:mm")}
            </Text>
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
          </DialogFooter>
          <DialogCloseTrigger onClick={handleModal} />
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};

export default AlertPermissionModal;
