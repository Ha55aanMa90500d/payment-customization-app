import { useState, useCallback } from 'react';
import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
    Icon,
    Button,
    InlineStack,
    Badge,
    DataTable,
    LegacyCard,
    Checkbox,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function AdditionalPage() {
    const [enableCheck, setEnableCheck] = useState(false);
    const handleChange = useCallback(
        (enableCheck) => {
            return setEnableCheck(enableCheck);
        },
        [],
    );
    const rows = [
        ['try description', <InlineStack align='end'><Checkbox onChange={handleChange} checked={enableCheck}></Checkbox></InlineStack>],
    ];
    const enableHeading = <InlineStack align='end'>Enable</InlineStack>;
    return (
        <>
            <Page
                backAction={{ content: 'Products', url: '/app/' }}
                title="Hiding Payments Method (B2B)"
                compactTitle
                primaryAction={{ content: 'New Rules'}}>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Box padding={'200'}>
                                <Text as="p" variant="bodyMd">
                                    Payment Method For B2B Customer Can be hidden here.
                                </Text>
                            </Box>
                            <LegacyCard>
                                <DataTable
                                    stickyHeader
                                    firstColumnMinWidth=''
                                    columnContentTypes={[
                                        'text',
                                        '',
                                    ]}
                                    headings={[
                                        'description',
                                        enableHeading,
                                    ]}
                                    rows={rows}
                                />
                            </LegacyCard>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    );
}

function Code({ children }) {
    return (
        <Box
            as="span"
            padding="025"
            paddingInlineStart="100"
            paddingInlineEnd="100"
            background="bg-surface-active"
            borderWidth="025"
            borderColor="border"
            borderRadius="100"
        >
            <code>{children}</code>
        </Box>
    );
}
