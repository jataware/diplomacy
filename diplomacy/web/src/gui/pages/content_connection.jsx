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
import {Connection} from "../../diplomacy/client/connection";
import {DipStorage} from "../utils/dipStorage";
import {Helmet} from "react-helmet";
import {Navigation} from "../components/navigation";
import {PageContext} from "../components/page_context";
import PropTypes from "prop-types";

export class ContentConnection extends React.Component {

    constructor(props) {
        super(props);
        this.connection = null;
        this.connect = this.connect.bind(this);

        // Load fields values from local storage.
        const initialState = this.initState();

        const savedState = DipStorage.getConnectionForm();

        if (savedState) {
            if (savedState.hostname)
                initialState.hostname = savedState.hostname;
            if (savedState.port)
                initialState.port = savedState.port;
            if (savedState.username)
                initialState.username = savedState.username;
            if (savedState.showServerFields)
                initialState.showServerFields = savedState.showServerFields;
        }
        this.state = initialState;
    }

    initState() {
        const { user } = this.props;

        return {
            hostname: window.location.hostname,
            port: 8432,
            username: user.username,
            password: user.attributes.sub,
            showServerFields: false
        };
    }

    connect() {

        const data = this.state;
        const page = this.context;

        page.info('Connecting ...');

        if (this.connection) {
            this.connection.currentConnectionProcessing.stop();
        }

        this.connection = new Connection(data.hostname, data.port, window.location.protocol.toLowerCase() === 'https:');
        this.connection.onReconnectionError = page.onReconnectionError;

        // Page is passed as logger object (with methods info(), error(), success()) when connecting.
        this.connection.connect(page)
            .then(() => {
                page.connection = this.connection;
                this.connection = null;

                page.success(`Successfully connected to server ${data.username}:${data.port}`);

                page.connection.authenticate(data.username, data.password)
                    .then((channel) => {
                        page.channel = channel;
                        return channel.getAvailableMaps();
                    })
                    .then(availableMaps => {
                        for (let mapName of Object.keys(availableMaps))
                            availableMaps[mapName].powers.sort();
                        page.availableMaps = availableMaps;
                        const userGameIndices = DipStorage.getUserGames(page.channel.username);
                        if (userGameIndices && userGameIndices.length) {
                            return page.channel.getGamesInfo({games: userGameIndices});
                        } else {
                            return null;
                        }
                    })
                    .then((gamesInfo) => {
                        if (gamesInfo) {
                            page.success('Found ' + gamesInfo.length + ' user games.');
                            page.updateMyGames(gamesInfo);
                        }
                        page.loadGames({success: `Account ${data.username} connected.`});
                    })
                    .catch((error) => {
                        page.error('Error while authenticating: ' + error + ' Please re-try.');
                    });
            })
            .catch((error) => {
                page.error('Error while connecting: ' + error + ' Please re-try.');
            });
    }

    render() {
        const title = 'Connecting...';
        return (
            <main>
                <Helmet>
                    <title>{title} | Diplomacy</title>
                </Helmet>
                <Navigation title={title}/>
            </main>
        );
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.connect();
    }
}

ContentConnection.contextType = PageContext;
ContentConnection.propTypes = {
    // TODO do we care to use shapes instead? Check
    user: PropTypes.object.isRequired
};
