// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
   const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );
  console.log(JSON.stringify(configuration));

  const paymentMethods = input?.paymentMethods;

  const operations = configuration?.flatMap((cfg) => {
    const matchingPaymentMethods = paymentMethods?.filter(
      (PM) => PM.name.toLowerCase().includes(cfg.paymentMethod.toLowerCase())
    );
    console.log(JSON.stringify(matchingPaymentMethods))
    return matchingPaymentMethods.map((paymentMethod) => ({
      move: {
        index: parseInt(cfg?.position, 10), // Convert the position to an integer
        paymentMethodId: paymentMethod?.id,
      },
    }));
  });

  console.log(JSON.stringify(operations))
  return {
    operations: operations
  }
}
