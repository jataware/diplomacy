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
            UserPoolId: poolId,
            Username: username
        }
    ).promise();
}

const HEADERS = {
    const isProd = process.env.ENV === 'prod';
    const allowedOrigin = isProd ? "https://diplomacy.jata.lol" : "http://localhost:3000";

    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "*"
};

const fail = (msg = 'Bad Request.') => ({
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
    // console.log(`ENV: ${JSON.stringify(process.env)}`);

    console.log('dev|prod:', process.env.ENV);

    if (get(event, 'requestContext.authorizer.claims')) {

        const { claims } = event.requestContext.authorizer;

        try {
            const username = claims['cognito:username'];
            const result = await consentAcceptTerms(username, process.env.AUTH_SHADE58086F6F58086F6F_USERPOOLID);

            log('Successfully updated user consent/terms acceptance date:', result);

            return success();

        } catch(err) {
            log('User accepted terms failure, error:', err);
            return fail(err.message);
        }
    }

    return fail('Not a valid authenticated user.');
};
