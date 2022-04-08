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
import {Page} from "./gui/pages/page";
import 'popper.js';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import PropTypes from "prop-types";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

// ========================================

// TODO These contents go into Page since are page elements. Will move soon.
const App = ({user, signOut}) => {
    return (
        <div>
          <header style={{width: "100%", background: "#CCBB99"}}>
            <span>
              Hello {user.username}
            </span>
            <button onClick={signOut}>Sign out</button>
          </header>

          <Page user={user} signOut={signOut} />

        </div>
    );
};
App.propTypes = {
    user: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired
};

const AuthenticatedApp = withAuthenticator(App);

ReactDOM.render(<AuthenticatedApp />, document.getElementById('root'));
