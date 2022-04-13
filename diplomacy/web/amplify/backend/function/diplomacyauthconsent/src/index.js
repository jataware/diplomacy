/* Amplify Params - DO NOT EDIT
	AUTH_DIPLOMACY8D729082_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { log } = console;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    if (event.requestContext.authorizer) {
        log('claims', event.requestContext.authorizer.claims);
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
