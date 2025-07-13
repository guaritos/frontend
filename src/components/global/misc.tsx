import { Center, CenterProps, Icon, Text } from "@chakra-ui/react";
import { FiBox } from "react-icons/fi";

interface EmptyContentProps extends CenterProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyContent({
    title = "No Content Available",
    description = "There is currently no content to display.",
    icon = <FiBox size={24} />,
    ...props
}: EmptyContentProps) {
    return (
        <Center {...props} color={"fg.muted"} flexDirection="column">
            {icon || <Icon as={FiBox} />}
            {title &&
                <Text fontSize="md" fontWeight="bold" mt={2}>
                    {title}
                </Text>
            }
            {description &&
                <Text color="fg.subtle" fontSize="sm" mt={1}>
                    {description}
                </Text>
            }
        </Center>
    );
}