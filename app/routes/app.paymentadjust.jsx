import { useState, useCallback } from 'react';
import {
    Box,
    Card,
    Layout,
    Page,
    Text,
    InlineStack,
    DataTable,
    LegacyCard,
    Checkbox,
} from "@shopify/polaris";
import { useLoaderData, json, useActionData, Form, useSubmit } from '@remix-run/react';
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const dataRes = await admin.graphql(
        `#graphql
            query myQuery {
                paymentCustomizations(first: 50) {
                    nodes {
                        enabled
                        functionId
                        id
                        title
                    }
                }
            }
        `
    );
    const resDataJson = await dataRes.json();
    const { data } = resDataJson;
    return json({ data });
}

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const response = await admin.graphql(
        `#graphql
            mutation paymentCustomizationUpdate($id: ID!, $paymentCustomization: PaymentCustomizationInput!) {
                paymentCustomizationUpdate(id: $id, paymentCustomization: $paymentCustomization) {
                    paymentCustomization {
                        id
                        enabled
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`,
        {
            variables: {
                "paymentCustomization": {
                    "enabled": true
                },
                "id": "gid://shopify/PaymentCustomization/30605508"
            },
        }
    );
    const responseJson = await response.json()
    return json({ responseJson });
}

export default function PaymentAdjust() {
    const loadedData = useLoaderData();
    const nodeData = loadedData?.data?.paymentCustomizations?.nodes;

    const actioData = useActionData();
    console.log(actioData);

    const submit = useSubmit();
    const submitData = (indexGet) => {
        const formData = new FormData();
        const checkIdstr = indexGet;
        formData.append('checkIdstr', checkIdstr);
        submit(formData, { method: 'post' });
        console.log(formData);
    };

    const rows = nodeData.map((item, index) => [
        item.title,
        <InlineStack align='end' key={index}>
            <Form action='/events' method='post'>
                <Checkbox checked={item.enabled} onChange={() => submitData(index)} />
            </Form>
        </InlineStack>
    ]);


    const enableHeading = <InlineStack align='end'>Enable</InlineStack>;

    return (
        <>
            <Page
                backAction={{ content: 'Products', url: '/app/' }}
                title="Order of Payment Methods"
                compactTitle
                primaryAction={{ content: 'New Rules', url: '/app/newrule' }}>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Box padding={'200'}>
                                <Text as="p" variant="bodyMd">
                                    Here the Order of the Payment can be Adjusted. Click the *New Rule* to assign a new position to a payment method.
                                </Text>
                            </Box>
                            <LegacyCard>
                                <DataTable
                                    stickyHeader
                                    firstColumnMinWidth=''
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                    ]}
                                    headings={[
                                        'Description',
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
