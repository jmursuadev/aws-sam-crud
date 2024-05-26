import {
    AuthenticationResultType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    InitiateAuthResponse,
    RespondToAuthChallengeCommand,
    SignUpCommand,
    SignUpResponse,
} from '@aws-sdk/client-cognito-identity-provider';

export const login = async (username: string, password: string): Promise<AuthenticationResultType> => {
    const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
    });

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    } as InitiateAuthCommandInput;

    try {
        const command = new InitiateAuthCommand(params);
        let response: InitiateAuthResponse = await cognitoClient.send(command);

        if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            const autoChallengeCommand = new RespondToAuthChallengeCommand({
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ClientId: process.env.USER_POOL_CLIENT_ID,
                ChallengeResponses: {
                    USERNAME: username,
                    NEW_PASSWORD: password,
                },
                Session: response.Session,
            });

            response = await cognitoClient.send(autoChallengeCommand);
        }

        if (response.AuthenticationResult) {
            return response.AuthenticationResult;
        } else {
            throw new Error('No authentication result');
        }
    } catch (error) {
        throw new Error(`Error logging in: ${error}`);
    }
};

export const signup = async (username: string, password: string): Promise<SignUpResponse> => {
    const cognitoClient = new CognitoIdentityProviderClient();

    const params = {
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: username,
        Password: password,
    };

    try {
        const command = new SignUpCommand(params);
        const response = await cognitoClient.send(command);

        return response;
    } catch (error) {
        throw new Error(`Error signing up: ${error}`);
    }
};
