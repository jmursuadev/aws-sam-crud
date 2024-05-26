import { APIGatewayProxyEvent, APIGatewayProxyResult, GroupOverrideDetails, Handler } from 'aws-lambda';

export const attachScope: Handler = async (event, context, callback): Promise<void> => {
    const newScopes = event.request.groupConfiguration.groupsToOverride.map(
        (item: GroupOverrideDetails) => `${item}-${event.callerContext.clientId}`,
    );

    event.response = {
        claimsOverrideDetails: {
            claimsToAddOrOverride: {
                scope: newScopes.join(' '),
            },
        },
    };

    callback(null, event);
};

export const index: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
                region: process.env.AWS_REGION,
            }),
        };
    } catch (err: unknown) {
        console.error(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};
