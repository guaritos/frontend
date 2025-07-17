"use client";

import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface CronInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export const CronInput = ({ value = "* * * * * *", onChange, placeholder }: CronInputProps) => {
    const [cronParts, setCronParts] = useState<string[]>([]);

    // Parse cron string into parts
    useEffect(() => {
        const parts = value.split(" ");
        // Ensure we have 6 parts (seconds, minutes, hours, day of month, months, day of week)
        while (parts.length < 6) {
            parts.push("*");
        }
        setCronParts(parts.slice(0, 6));
    }, [value]);

    // Update specific cron part
    const updateCronPart = (index: number, newValue: string) => {
        const newParts = [...cronParts];
        newParts[index] = newValue || "*";
        setCronParts(newParts);

        const cronString = newParts.join(" ");
        onChange?.(cronString);
    };

    // Generate human readable description
    const getCronDescription = () => {
        const [seconds, minutes, hours, dayOfMonth, months, dayOfWeek] = cronParts;

        if (cronParts.every(part => part === "*")) {
            return "Runs every second";
        }

        let description = "Runs ";

        // Handle seconds
        if (seconds === "*") {
            description += "every second";
        } else if (seconds.includes("/")) {
            const interval = seconds.split("/")[1];
            description += `every ${interval} seconds`;
        } else {
            description += `at second ${seconds}`;
        }

        // Handle minutes
        if (minutes !== "*") {
            if (minutes.includes("/")) {
                const interval = minutes.split("/")[1];
                description += `, every ${interval} minutes`;
            } else {
                description += `, at minute ${minutes}`;
            }
        }

        // Handle hours
        if (hours !== "*") {
            if (hours.includes("/")) {
                const interval = hours.split("/")[1];
                description += `, every ${interval} hours`;
            } else {
                description += `, at ${hours}:00`;
            }
        }

        // Handle day of month
        if (dayOfMonth !== "*") {
            description += `, on day ${dayOfMonth} of the month`;
        }

        // Handle months
        if (months !== "*") {
            const monthNames = ["", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            if (months.includes("-")) {
                description += `, from month ${months}`;
            } else {
                description += `, in ${monthNames[parseInt(months)] || `month ${months}`}`;
            }
        }

        // Handle day of week
        if (dayOfWeek !== "*") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            if (dayOfWeek.includes("-")) {
                description += `, on weekdays ${dayOfWeek}`;
            } else {
                description += `, on ${dayNames[parseInt(dayOfWeek)] || `day ${dayOfWeek}`}`;
            }
        }

        return description;
    };

    const labels = [
        { label: "seconds", placeholder: "0-59" },
        { label: "minutes", placeholder: "0-59" },
        { label: "hours", placeholder: "0-23" },
        { label: "day of month", placeholder: "1-31" },
        { label: "months", placeholder: "1-12" },
        { label: "day of week", placeholder: "0-6" },
    ];

    return (
        <Box>
            <VStack align="start" gap={3}>
                {/* Visual representation */}
                <HStack gap={2} fontFamily="mono" fontSize="sm">
                    {cronParts.map((part, index) => (
                        <Box key={index}>
                            <Text color="primary" fontWeight="bold">
                                {part}
                            </Text>
                            {index < cronParts.length - 1 && (
                                <Text as="span" mx={1} color="fg.muted">|</Text>
                            )}
                        </Box>
                    ))}
                </HStack>

                {/* Input fields */}
                <VStack align="start" gap={2} w="full">
                    {labels.map((field, index) => (
                        <HStack key={index} gap={3} w="full" align="center">
                            <Box w="2px" h="20px" bg="primary" />
                            <Input
                                size="sm"
                                w="80px"
                                value={cronParts[index]}
                                onChange={(e) => updateCronPart(index, e.target.value)}
                                placeholder="*"
                                fontFamily="mono"
                                textAlign="center"
                            />
                            <Text fontSize="sm" color="fg.muted" minW="120px">
                                {field.label}
                            </Text>
                        </HStack>
                    ))}
                </VStack>

                {/* Live preview */}
                <Box bg="bg.subtle" p={"4"} rounded="2xl" w="full">
                    <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                        {getCronDescription()}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};
