"use client";

import { chakra, HTMLChakraProps, Input, ListCollection } from "@chakra-ui/react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RuleYamlEditor } from "@/engines/RuleBasedYamlEditor";
import { SelectRoot } from "@/components/ui/select";

interface Props extends HTMLChakraProps<"div"> {

}

interface CreateTracerFormData {
    account: string;
    mode: "odt" | "rbt";
    rule: string;
}

const createTracerFormSchema = z.object({
    account: z.string().min(1, "Account is required"),
    mode: z.enum(["odt", "rbt"]),
    rule: z.string().min(1, "Rule is required")
});


export function CreateTracerForm({ children, ...props }: Props) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateTracerFormData>({
        defaultValues: {
            account: "",
            mode: "odt",
            rule: ""
        },
        resolver: zodResolver(createTracerFormSchema)
    });

    const onSubmit: SubmitHandler<CreateTracerFormData> = (data) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };

    const onErrorHandler: SubmitErrorHandler<CreateTracerFormData> = (errors) => {
        console.error("Form submission errors:", errors);
    }

    return (
        <chakra.div {...props}>
            <form onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
                <Controller
                    name="account"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter account address"
                        />
                    )}
                />
                <Controller
                    name="mode"
                    control={control}
                    render={({ field }) => (
                        <SelectRoot
                            collection={ListCollection}
                            onValueChange={(e) => field.onChange(e)}
                        />
                    )}
                />
                <Controller
                    name="rule"
                    control={control}
                    render={({ field }) => (
                        <RuleYamlEditor
                            defaultValue={field.value}
                            onChange={(field.onChange)}
                        />
                    )}
                />
            </form>
        </chakra.div>
    )
}