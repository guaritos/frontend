"use client";

import { Button, chakra, createListCollection, HStack, Input, ListCollection, SelectControl, StackProps, VStack } from "@chakra-ui/react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RuleYamlEditor } from "@/engines/RuleBasedYamlEditor";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface Props extends StackProps {

}

interface CreateRuleFormData {
    rule?: string;
}

const createRuleFormSchema = z.object({
    rule: z.string().optional()
});



export function CreateRuleForm({ children, ...props }: Props) {
    const { account } = useWallet();

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateRuleFormData>({
        defaultValues: {
            rule: ""
        },
        resolver: zodResolver(createRuleFormSchema)
    });

    const rule = watch("rule");

    const onSubmit: SubmitHandler<CreateRuleFormData> = (data) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };

    const onErrorHandler: SubmitErrorHandler<CreateRuleFormData> = (errors) => {
        console.error("Form submission errors:", errors);
    }

    return (
        <chakra.form w={"full"} onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
            <VStack w={"full"} gap={"6"} {...props}>
                <Controller
                    name="rule"
                    control={control}
                    render={({ field }) => (
                        <Field label="Rule" errorText={errors.rule?.message}>
                            <RuleYamlEditor
                                defaultValue={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        </Field>
                    )}
                />
                <HStack justify={"end"} w={"full"}>
                    <Button type="submit" rounded={"full"} loading={isSubmitting} colorPalette={"primary"}>
                        Create Rule
                    </Button>
                </HStack>
            </VStack>
        </chakra.form>
    )
}