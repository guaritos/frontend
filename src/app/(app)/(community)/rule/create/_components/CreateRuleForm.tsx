"use client";

import { Button, chakra, createListCollection, HStack, Input, ListCollection, SelectControl, StackProps, VStack } from "@chakra-ui/react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RuleYamlEditor } from "@/engines/RuleBasedYamlEditor";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import YAML from 'yaml';
import { useCreateRule } from "@/hooks";
import { toaster } from "@/components/ui/toaster";

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
    const [enabledRule, setEnabledRule] = useState(false)

    const { mutateAsync: createRule } = useCreateRule();

    const {
        register,
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateRuleFormData>({
        defaultValues: {
            rule: ""
        },
        resolver: zodResolver(createRuleFormSchema)
    });

    const onSubmit: SubmitHandler<CreateRuleFormData> = async (data) => {
        await createRule({
            data: data.rule
        })
    };

    const onErrorHandler: SubmitErrorHandler<CreateRuleFormData> = (errors) => {
        toaster.error({
            title: "Error",
            description: errors.rule?.message || "An error occurred while creating the rule."
        });
    }

    return (
        <chakra.form w={"full"} onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
            <VStack w={"full"} gap={"6"} {...props}>
                <Field label="Enable Rule" helperText="Enable to activate immediately after creation">
                    <Switch
                        label="Enable Rule"
                        checked={enabledRule}
                        onCheckedChange={(e) => {
                            try {
                                const currentRule = watch("rule") || "";
                                const ruleObject = YAML.parse(currentRule) || {};

                                ruleObject.enabled = e.checked;

                                const updatedYaml = YAML.stringify(ruleObject);
                                setValue("rule", updatedYaml);
                                setEnabledRule(e.checked);
                            } catch (err) {
                                console.error("Invalid YAML format", err);
                            }
                        }}
                    />
                </Field>
                <Controller
                    name="rule"
                    control={control}
                    render={({ field }) => (
                        <Field label="Rule" errorText={errors.rule?.message}>
                            <RuleYamlEditor
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        </Field>
                    )}
                />
                <HStack justify={"end"} w={"full"}>
                    <Button type="submit" rounded={"full"} loadingText={"Creating"} loading={isSubmitting} colorPalette={"primary"}>
                        Create Rule
                    </Button>
                </HStack>
            </VStack>
        </chakra.form>
    )
}