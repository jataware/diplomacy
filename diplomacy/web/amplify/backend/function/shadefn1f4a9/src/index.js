/* Amplify Params - DO NOT EDIT
	AUTH_SHADE58086F6F58086F6F_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/*
 * This file handles accepting an API reques to consent/ and, if the session is
 * valid, saves the user consent (terms of use) acceptance as a user attribute on
 * the cognito user pool.
 */

const AWS = require('aws-sdk');
const get = require('lodash/get');

AWS.config.update({region: 'us-east-1'});
const { log } = console;

const cisProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
});

/*
  Given a full Cognito userpool url, like:
  'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_SwQyPAMV5'

  returns the userPoolId.
 */
const getUserPoolId = cognitoUrl => {
    let result = cognitoUrl.split("/");
    result = result[result.length - 1];

    return result;
};

/**
 * Calls cognito userpool admin api to update the user's accepted-terms with current datetime.
 **/
function consentAcceptTerms(username, poolId) {
    const now = new Date();
    const datetimeFormatted = JSON.parse(JSON.stringify(now));

    log('Adding this acceptance date to user:', datetimeFormatted, username, poolId);

    return cisProvider.adminUpdateUserAttributes(
        {
            UserAttributes: [
                {
                    Name: 'custom:accepted-terms-at',
                    Value: datetimeFormatted
                }
            ],
            // OR process.env.AUTH_SHADE58086F6F58086F6F_USERPOOLID
            UserPoolId: poolId,
            Username: username
        }
    ).promise();
}

const HEADERS = {
    // TODO Add an origin list of localhost, dev, prod
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
};

const fail = (msg='Bad Request.') => ({
    statusCode: 400,
    headers: HEADERS,
    body: JSON.stringify(msg),
});

const success = () => ({
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify('User consent update was successful.'),
});


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`ENV: ${JSON.stringify(process.env)}`);

    console.log('dev|Prod:', process.env.ENV);


    if (get(event, 'requestContext.authorizer.claims')) {

        console.log('Contains claims, continuing');

        const { claims } = event.requestContext.authorizer;

        try {
            // TODO verify if preferred username is still named cognito:username
            const username = claims['cognito:username'];
            const poolId = getUserPoolId(claims.iss);

            const result = await consentAcceptTerms(username, poolId);
            log('Successfully updated user consent/terms acceptance date:', result);

            return success();

        } catch(err) {
            log('User accepted terms failure, error:', err);
            return fail(err.message);
        }
    }

    return fail('No claims associated, no authenticated used.');
};
