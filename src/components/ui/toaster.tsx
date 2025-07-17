"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root bg={"bg"} backdropFilter={"blur(64px)"} rounded={"2xl"} width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator
                color={
                  toast.type === "error" ? "red" :
                    toast.type === "success" ? "green" :
                      toast.type === "info" ? "blue" : "fg"
                }
              />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title &&
                <Toast.Title
                  color={
                    toast.type === "error" ? "orange" :
                      toast.type === "success" ? "green" :
                        toast.type === "info" ? "blue" : "fg"
                  }
                >
                  {toast.title}
                </Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
