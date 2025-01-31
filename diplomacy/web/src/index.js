// ==============================================================================
// Copyright (C) 2019 - Philip Paquette, Steven Bocco
//
//  This program is free software: you can redistribute it and/or modify it under
//  the terms of the GNU Affero General Public License as published by the Free
//  Software Foundation, either version 3 of the License, or (at your option) any
//  later version.
//
//  This program is distributed in the hope that it will be useful, but WITHOUT
//  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
//  FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
//  details.
//
//  You should have received a copy of the GNU Affero General Public License along
//  with this program.  If not, see <https://www.gnu.org/licenses/>.
// ==============================================================================
import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'popper.js';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { uniqueNamesGenerator, colors, animals, names, NumberDictionary } from 'unique-names-generator';

import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '@aws-amplify/ui-react/styles.css';

import { Page } from "./gui/pages/page";
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const generateUsername = () => {
    const numberDictionary = NumberDictionary.generate({ min: 0, max: 124 });

    return uniqueNamesGenerator({
        dictionaries: [colors, animals, names, numberDictionary],
        style: 'capital',
        separator: ''
    });
};

const services = {
    async handleSignUp(formData) {
        formData.attributes.preferred_username = generateUsername();
        return Auth.signUp(formData);
    }
};

const theme = createTheme({
});

/**
 * Authenticated Application. Basically wraps the Page root component with AWS Cognito Auth.
 */
const App = () => (
    <Authenticator
        variation="modal"
        services={services}
        signUpAttributes={['email']}>

        {({ signOut, user }) => (
            <ThemeProvider theme={theme}>
                <Page user={user} signOut={signOut} />
            </ThemeProvider>
        )}

    </Authenticator>
);

ReactDOM.render(<App />, document.getElementById('root'));
