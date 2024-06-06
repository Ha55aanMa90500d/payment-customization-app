import { useState, useCallback } from 'react';
import {
    Box,
    Banner,
    Card,
    Layout,
    Page,
    Checkbox,
    Button,
    TextField,
    Grid,
} from "@shopify/polaris";
import { Form, useSubmit, useActionData, json } from '@remix-run/react';
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const rulesData = formData.get('rulesData');
    const checkData = formData.get('checkData') === 'true';
    const rulesDataJson = JSON.parse(rulesData)
    console.log(`----------------------------------------------------${checkData}--------------------------------------------------`);
    const paymentCustomizationInput = {
        functionId: "f228ad36-0c3e-4899-b84d-ec27a958b524",
        title: "Data Send",
        enabled: checkData,
        metafields: [
            {
                namespace: "$app:order-sorting",
                key: "function-configuration",
                type: "json",
                value: rulesData,
            },
        ],
    };

    const response = await admin.graphql(
        `#graphql
            mutation createPaymentCustomization($input: PaymentCustomizationInput!) {
                paymentCustomizationCreate(paymentCustomization: $input) {
                    paymentCustomization {
                        id
                    }
                    userErrors {
                        message
                    }
                }
            }`,
        {
            variables: {
                input: paymentCustomizationInput,
            },
        }
    );
    const responseJson = await response.json()
    return json({ responseJson });
}

export default function newrule() {
    const [enableCheck, setEnableCheck] = useState(true);
    const handleChange = useCallback(
        (newValue) => setEnableCheck(newValue),
        [],
    );

    const [fields, setFields] = useState([{ paymentMethod: '', position: '' }]);

    const addFields = () => {
        const newField = { paymentMethod: '', position: '' };
        setFields([...fields, newField]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = value;
        setFields(updatedFields);
    };

    const [succeed, setSucceed] = useState(false);
    // const showSuccess = () => {
    //     const actionData = useActionData();
    //     if (actionData != undefined) {
    //         console.log(actionData);
    //         setSucceed(true);
    //     } else {
    //         console.log('..');
    //     }
    // }

    const submit = useSubmit();
    const submitData = () => {
        const rulesData = JSON.stringify(fields);
        const formData = new FormData();
        formData.append('rulesData', rulesData);
        formData.append('checkData', enableCheck);
        submit(formData, { method: 'post' });
        // showSuccess();
        setTimeout(() => {
            setSucceed(true);
        }, 1000);
    };

    return (
        <>
            <Form method="post" action="/app/paymentadjust">
                <input type="hidden" name="rulesData" value={fields[0]} />
                <input type="hidden" name="checkData" value={enableCheck} />
                <Page
                    backAction={{ content: 'Products', url: '/app/paymentadjust' }}
                    title="Set Payment Method Position"
                    secondaryActions={[
                        { content: 'Delete', destructive: true },
                    ]}
                    primaryAction={{
                        content: 'Save',
                        onAction: submitData,
                    }}
                >
                    <Layout>
                        <Layout.Section>
                            <Card>
                                {succeed &&
                                    <Banner title="The Payment Sorting Function has been created Successfully" tone='success'>
                                    </Banner>
                                }
                                <Box padding="200">
                                    <Checkbox label="Enable" checked={enableCheck} onChange={handleChange} />
                                </Box>
                                {fields.map((field, index) => (
                                    <Grid key={index}>
                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                            <TextField
                                                label="Payment Method"
                                                type="text"
                                                autoComplete="off"
                                                value={field.paymentMethod}
                                                onChange={(value) => handleInputChange(index, 'paymentMethod', value)}
                                                requiredIndicator
                                            />
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                            <TextField
                                                label="Position"
                                                type="integer"
                                                autoComplete="off"
                                                value={field.position}
                                                onChange={(value) => handleInputChange(index, 'position', value)}
                                                requiredIndicator
                                            />
                                        </Grid.Cell>
                                    </Grid>
                                ))}
                                <Button onClick={addFields}>Add Method</Button>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            </Form>
        </>
    );
}

// function Code({ children }) {
//     return (
//         <Box
//             as="span"
//             padding="025"
//             paddingInlineStart="100"
//             paddingInlineEnd="100"
//             background="bg-surface-active"
//             borderWidth="025"
//             borderColor="border"
//             borderRadius="100"
//         >
//             <code>{children}</code>
//         </Box>
//     );
// }
