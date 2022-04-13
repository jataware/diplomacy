/* Amplify Params - DO NOT EDIT
	AUTH_DIPLOMACY8D729082_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/*
 * This file handles accepting an API reques to consent/ and, if the session is
 * valid, saves the user consent (terms of use) acceptance as a user attribute on
 * the cognito user pool.
 */

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const { log } = console;

const cisProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
});

const originalCognitoPoolIdFallback = "us-east-1_SwQyPAMV5";

/*
  Given a full Cognito userpool url, like:
  'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_SwQyPAMV5'

  returns the userPoolId.
 */
const getUserPoolId = cognitoUrl => {
    let result = cognitoUrl.split("/");
    result = result[result.length - 1];

    return result || originalCognitoPoolIdFallback;
};

/**
 * Calls cognito userpool admin api to update the user's accepted-terms with current datetime.
 **/
function consentAcceptTerms(username, poolId) {
    const now = new Date();
    const datetimeFormatted = JSON.parse(JSON.stringify(now));

    log('Adding this acceptance date to user:', datetimeFormatted);

    return cisProvider.adminUpdateUserAttributes(
        {
            UserAttributes: [
                {
                    Name: 'custom:accepted-terms-at',
                    Value: datetimeFormatted
                }
            ],
            UserPoolId: poolId,
            Username: username
        }
    ).promise();
}

const fail = () => ({
    statusCode: 400,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify('Bad Request.'),
});

const success = () => ({
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify('User consent update successful.'),
});


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
    // console.log(`EVENT: ${JSON.stringify(event)}`);

    const { claims } = event.requestContext.authorizer;

    if (claims) {
        try {
            const username = claims['cognito:username'];
            const poolId = getUserPoolId(claims.iss);

            const result = await consentAcceptTerms(username, poolId);
            log('Successfully updated user consent/terms acceptance date:', result);

            return success();

        } catch(err) {
            log('User accepted terms failure, error:', err);
            return fail();
        }
    }

    return fail();
};
