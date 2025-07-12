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

interface CreateTracerFormData {
    account: string;
    mode: "odt" | "rbt";
    rule?: string;
}

const createTracerFormSchema = z.object({
    account: z.string().min(1, "Account is required"),
    mode: z.enum(["odt", "rbt"]),
    rule: z.string().optional()
});

const modeCollection = createListCollection({
    items: [
        { value: "odt", label: "ODT" },
        { value: "rbt", label: "RBT" }
    ]
});

export function CreateTracerForm({ children, ...props }: Props) {
    const { account } = useWallet();

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateTracerFormData>({
        defaultValues: {
            account: account?.address.toString() || "",
            mode: modeCollection.items[0].value as CreateTracerFormData["mode"],
            rule: ""
        },
        resolver: zodResolver(createTracerFormSchema)
    });

    const mode = watch("mode");
    const rule = watch("rule");

    const onSubmit: SubmitHandler<CreateTracerFormData> = (data) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };

    const onErrorHandler: SubmitErrorHandler<CreateTracerFormData> = (errors) => {
        console.error("Form submission errors:", errors);
    }

    return (
        <chakra.form w={"full"} onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
            <VStack w={"full"} gap={"6"} {...props}>
                <Controller
                    name="account"
                    control={control}
                    render={({ field }) => (
                        <Field label="Account" errorText={errors.account?.message}>
                            <Input
                                placeholder="Enter account address"
                                {...field}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="mode"
                    control={control}
                    render={({ field }) => (
                        <Field label="Mode" errorText={errors.mode?.message}>
                            <SelectRoot
                                collection={modeCollection}
                                defaultValue={[modeCollection.items[0].value]}
                                onValueChange={(e) => field.onChange(e.value[0])}
                            >
                                <SelectControl>
                                    <SelectTrigger>
                                        <SelectValueText
                                            placeholder="Select mode"
                                        />
                                    </SelectTrigger>
                                </SelectControl>
                                <SelectContent>
                                    {modeCollection.items.map((item) => (
                                        <SelectItem key={item.value} item={item}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                        </Field>
                    )}
                />
                {
                    mode === "rbt" && (
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
                    )
                }
                <HStack justify={"end"} w={"full"}>
                    <Button type="submit" rounded={"full"} loading={isSubmitting} colorPalette={"primary"}>
                        Create Tracer
                    </Button>
                </HStack>
            </VStack>
        </chakra.form>
    )
}