/* Amplify Params - DO NOT EDIT
	AUTH_DIPLOMACY8D729082_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const { log } = console;

const cognitoidentityserviceprovider =
      new AWS.CognitoIdentityServiceProvider({
          apiVersion: '2016-04-18'
      });

/**
 * TODO doc, maybe update custom user accepted attribute
 **/
function consentAcceptTerms(event, callback) {
    const now = new Date();
    const datetimeFormatted = JSON.parse(JSON.stringify(now));

    log('Adding this acceptance date to user:', datetimeFormatted);

    return cognitoidentityserviceprovider.adminUpdateUserAttributes(
        {
            UserAttributes: [
                {
                    Name: 'custom:accepted-terms-at',
                    Value: datetimeFormatted
                }
            ],
            UserPoolId: event.userPoolId,
            Username: event.userName
        }
    ).promise();
}

const fail = () => ({
    statusCode: 400,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
    // TODO better msg
    body: JSON.stringify('What a fail.'),
});

const success = () => ({
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
    // TODO better msg
    body: JSON.stringify('Update successful.'),
});


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    if (event.requestContext.authorizer.claims) {
        try {
            const result = await consentAcceptTerms(event);
            log('Successfully updated user consent/terms acceptance date:', result);

            return success();

        } catch(err) {

            log('User accepted terms failure, error:', err);
            return fail();
        }
    }

    return fail();
    
};
