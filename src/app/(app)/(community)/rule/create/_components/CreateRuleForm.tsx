"use client";

import { Button, chakra, Text, HStack, Icon, StackProps, VStack, DialogRootProps, Input } from "@chakra-ui/react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RuleYamlEditor } from "@/engines/RuleBasedYamlEditor";
import { Field } from "@/components/ui/field";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import YAML from 'yaml';
import { useCreateRule } from "@/hooks";
import { toaster } from "@/components/ui/toaster";
import { useGetRulesTemplate } from "@/hooks/useGetRulesTemplate";
import { DialogRoot, DialogBody, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HiPlus } from "react-icons/hi";
import { ruleSchema } from "@/zodScheme/ruleBased";
import { RuleBasedCard } from "@/app/(app)/_components/RuleBasedCard";
import { CronInput } from "./CronInput";

interface Props extends StackProps {

}

interface CreateRuleFormData {
    rule?: string;
}

const createRuleFormSchema = z.object({
    rule: z.string().optional()
});

interface RuleTemplatePickDialogProps extends Omit<DialogRootProps, 'children'> {
    onTemplateSelect: (template: any) => void;
    selectedTemplate?: z.infer<typeof ruleSchema> | null;
}

const RuleTemplatePickDialog = ({ onTemplateSelect, selectedTemplate, ...props }: RuleTemplatePickDialogProps) => {
    const { data: rulesTemplate } = useGetRulesTemplate()
    const [open, setOpen] = useState(false);

    return (
        <DialogRoot open={open}
            onOpenChange={e => {
                setOpen(e.open);
            }}
            {...props}
        >
            <DialogTrigger asChild>
                <Button variant={"plain"} size={"sm"} colorPalette={"default"} rounded={"full"}>
                    <Icon as={HiPlus} />
                    Choose Template
                </Button>
            </DialogTrigger>
            <DialogContent
                w={"full"}
                rounded={"3xl"}
                border={"1px solid"}
                borderColor={"border.emphasized"}
                bg={"bg.panel/75"}
                backdropFilter={"blur(64px)"}
            >
                <DialogHeader>
                    <Text fontSize={"lg"} fontWeight={"bold"}>Choose a Rule Template</Text>
                    <Text fontSize={"sm"} color={"fg.subtle"}>
                        Select a template to start with.
                    </Text>
                </DialogHeader>
                <DialogBody>
                    <VStack align={"start"} gap={"4"}>
                        {rulesTemplate?.map((template) => (
                            <RuleBasedCard
                                rule={template}
                                key={template.id}
                                border={selectedTemplate?.id === template.id ? "2px solid" : "none"}
                                borderColor={"primary.solid"}
                                onClick={() => {
                                    onTemplateSelect(template);
                                }}
                            />
                        ))}
                    </VStack>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    )
}
export function CreateRuleForm({ children, ...props }: Props) {
    const { account } = useWallet();
    const [enabledRule, setEnabledRule] = useState(false)
    const [isTemplate, setIsTemplate] = useState(false);
    const { mutateAsync: createRule } = useCreateRule();
    const [ruleTemplate, setRuleTemplate] = useState<z.infer<typeof ruleSchema> | null>(null);
    const [sourceAddress, setSourceAddress] = useState("");
    const [inOwnerBlacklist, setInOwnerBlacklist] = useState(false);
    const [inCommunityBlacklist, setInCommunityBlacklist] = useState(false);
    const [cronValue, setCronValue] = useState("* * * * * *");

    const {
        register,
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateRuleFormData>({
        defaultValues: {
            rule: YAML.stringify({
                name: "New Rule",
                description: "This is a new rule",
                tags: [],
                user_id: account?.address.toString() || "",
                cron: "* * * * * *", // Every second
                source: sourceAddress,
                isTemplate: false,
                enabled: false,
                when: {
                    and: []
                },
                then: [],
            } as Omit<z.infer<typeof ruleSchema>, "id" | "user_id" | "source" | "name" | "created_at">),
        },
        resolver: zodResolver(createRuleFormSchema)
    });

    // Update form fields when YAML changes
    const updateFieldsFromYaml = (yamlString: string) => {
        try {
            const ruleObject = YAML.parse(yamlString);
            if (ruleObject) {
                setSourceAddress(ruleObject.source || "");
                setEnabledRule(ruleObject.enabled || false);
                setIsTemplate(ruleObject.is_template || false);
                setInOwnerBlacklist(ruleObject.in_owner_blacklist || false);
                setInCommunityBlacklist(ruleObject.in_community_blacklist || false);
                setCronValue(ruleObject.cron || "* * * * * *");
            }
        } catch (err) {
            // Ignore parse errors when YAML is being edited
        }
    };

    // Update YAML when individual fields change
    const updateYamlFromFields = () => {
        try {
            const currentRule = watch("rule") || "";
            const ruleObject = YAML.parse(currentRule);

            ruleObject.source = sourceAddress;
            ruleObject.enabled = enabledRule;
            ruleObject.is_template = isTemplate;
            ruleObject.in_owner_blacklist = inOwnerBlacklist;
            ruleObject.in_community_blacklist = inCommunityBlacklist;
            ruleObject.cron = cronValue;

            const updatedYaml = YAML.stringify(ruleObject);
            setValue("rule", updatedYaml);
        } catch (err) {
            console.error("Error updating YAML:", err);
        }
    };

    // Initialize fields from default YAML
    useEffect(() => {
        const defaultRule = watch("rule");
        if (defaultRule) {
            updateFieldsFromYaml(defaultRule);
        }
    }, []);

    const onSubmit: SubmitHandler<CreateRuleFormData> = async (data) => {
        if (!account) {
            toaster.error({
                title: "Wallet not connected",
                description: "Please connect your wallet to create a rule."
            });
            return;
        }

        const ruleObject = YAML.parse(data.rule || "");
        ruleObject.source = sourceAddress;
        ruleObject.user_id = account.address.toString();
        ruleObject.enabled = enabledRule;
        ruleObject.is_template = isTemplate;
        ruleObject.in_owner_blacklist = inOwnerBlacklist;
        ruleObject.in_community_blacklist = inCommunityBlacklist;

        const updatedYaml = YAML.stringify(ruleObject);

        await createRule({
            data: updatedYaml
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
                <Field label="Source Address" helperText="Source address to trace">
                    <Input
                        value={sourceAddress}
                        onChange={(e) => {
                            setSourceAddress(e.target.value);
                        }}
                        onBlur={updateYamlFromFields}
                        placeholder="Enter account address"
                    />
                </Field>
                <Field label="Cron Schedule" helperText="Set the execution schedule for this rule">
                    <CronInput
                        value={cronValue}
                        onChange={(newCronValue) => {
                            setCronValue(newCronValue);
                            // Update YAML immediately for cron changes
                            setTimeout(updateYamlFromFields, 100);
                        }}
                    />
                </Field>
                <Field label="Enable Rule" helperText="Enable to activate immediately after creation">
                    <Switch
                        label="Enable Rule"
                        checked={enabledRule}
                        onCheckedChange={(e) => {
                            setEnabledRule(e.checked);
                            setTimeout(updateYamlFromFields, 100);
                        }}
                    />
                </Field>
                <Field label="Template" helperText="Choose this if rule is a template">
                    <Switch
                        label="Template"
                        checked={isTemplate}
                        onCheckedChange={(e) => {
                            setIsTemplate(e.checked);
                            setTimeout(updateYamlFromFields, 100);
                        }}
                    />
                </Field>
                <HStack w={"full"} justifyContent={"space-between"}>
                    <Field label="In Owner Blacklist" helperText="Check if rule should be in owner blacklist">
                        <Switch
                            label="In Owner Blacklist"
                            checked={inOwnerBlacklist}
                            onCheckedChange={(e) => {
                                setInOwnerBlacklist(e.checked);
                                setTimeout(updateYamlFromFields, 100);1
                            }}
                        />
                    </Field>
                    <Field label="In Community Blacklist" helperText="Check if rule should be in community blacklist">
                        <Switch
                            label="In Community Blacklist"
                            checked={inCommunityBlacklist}
                            onCheckedChange={(e) => {
                                setInCommunityBlacklist(e.checked);
                                setTimeout(updateYamlFromFields, 100);
                            }}
                        />
                    </Field>
                </HStack>
                <Controller
                    name="rule"
                    control={control}
                    render={({ field }) => (
                        <Field w={"full"} label={
                            <HStack w={"full"} justifyContent={"space-between"}>
                                <Text fontSize="sm">Rule YAML</Text>
                                <RuleTemplatePickDialog
                                    onTemplateSelect={(template) => {
                                        setRuleTemplate(template);
                                        field.onChange(YAML.stringify(template));
                                        // Update fields from the new template
                                        updateFieldsFromYaml(YAML.stringify(template));
                                    }}
                                    selectedTemplate={ruleTemplate}
                                />
                            </HStack>
                        } errorText={errors.rule?.message}>
                            <RuleYamlEditor
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    // Update fields when YAML is manually edited
                                    if (value) {
                                        updateFieldsFromYaml(value);
                                    }
                                }}
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