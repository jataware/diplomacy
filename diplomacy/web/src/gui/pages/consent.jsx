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

/** **/

import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Text from '@mui/material/Typography';
import Box from '@mui/material/Box';

const articles = [
    {
        heading: false,
        text: 'We are inviting you to participate in a research study into the role of player negotiation in the board game Diplomacy. The study, titled “Collection and analysis of online Diplomacy gameplay,” is part of a project funded by the U.S. Department of Defense.  I will describe this study to you and answer any of your questions.  This study is led by Prof. Garrison LeMasters, Miami University Dept. of Emerging Technologies.'
    },
    {
        heading: 'What the study is about',
     text: 'The purpose of this research is to develop an artificial intelligence that can meaningfully compete with human players of the board game Diplomacy. In order to build an AI that can succeed at the game of Diplomacy, we have designed an interface that humans can use to play the game, and we will train the AI on the data that human users generate through their game play.'
    },
    {
        heading: 'What we will ask you to do',
        text: 'We will ask you to play an anonymized game of Diplomacy using our interface to communicate with other players.  A game of Diplomacy can take up to six hours. Other than the interface we provide for in-game communication (“press”) and online gameplay, there are no changes to the game.'
    },
    {
        heading: 'Risks and discomforts',
        text: 'We do not anticipate any risks from participating in this research.'
    },
    {
        heading: 'Benefits',
        text: 'There are no direct benefits to participants of this study. Information from this study may help to build AI that can successfully negotiate with other AI or with humans, specifically in contract disputes or diplomatic negotiations.'
    },
    {
        heading: 'Compensation for participation',
        text: 'Students who participate in this study and are enrolled in IMS443 (Games Research) will receive in-class credit, per the syllabus (Spring 2022).  Students not enrolled in that course may receive monetary compensation of $15.'
    },
    {
        heading: 'Privacy/Confidentiality/Data Security',
        text: 'No data will have identifiers attached to it. The survey that we administer after playing should present no greater risk than everyday use of the Internet. Data may exist on backups and server logs beyond the timeframe of this research project. Representatives of the U.S. Department of Defense will have access to research records as part of their responsibilities for human subjects protection oversight of the study.'
    },
    {
        heading: 'Sharing De-identified Data Collected in this Research',
        text: 'De-identified data from this study may be shared with the research community at-large to advance science. We will remove or code any personal information that could identify you before files are shared with other researchers to ensure that, by current scientific standards and known methods, no one will be able to identify you from the information we share. Despite these measures, we cannot guarantee anonymity of your personal data.'
    },
    {
        heading: 'Taking part is voluntary',
        text: 'Participant involvement is voluntary.  You may refuse to participate before the study begins or discontinue at any time. Compensation is dependent upon your completing the study and answering the survey questions afterwards.'
    },
    {
        heading: 'If you have questions',
        text: 'I am the primary researcher conducting this study.  I am Dr. Garrison LeMasters, Dept. of Emerging Technology / Games and Simulation, Miami University of Ohio.  I am happy to talk with you about concerns regarding this research, or you may email me at garrison.lemasters@miamioh.edu'
    }
];




/**
 * Application page that describes IRB-mandated consent terms to the user,
 * per research data gathered while playing. If user accepts, the acceptance date
 * gets stored on auth user pool. If user declines, they should be logged out.
 **/
export const ConsentPage = ({onAccept, onDecline}) => {

    return (

        <Container maxWidth="md">
            <section style={{margin: "1rem 0 2rem 0"}}>
                <br />

                <Text
                    variant="h4"
                    gutterBottom>
                    IRB Research Consent Form
                </Text>

                {articles.map(article => (
                    <article key={article.heading}>
                        {article.heading && (
                            <Text variant="h5" gutterBottom>
                                {article.heading}
                            </Text>
                        )}
                        <Text paragraph>
                            {article.text}
                        </Text>
                    </article>
                ))}

                <div>
                    By clicking "Accept", I agree that I am digitally signing this consent form.
                </div>

                <br />

                <Box sx={{textAlign: 'center'}}>
                    <button
                        className="btn btn-success"
                        onClick={onAccept}>
                        Accept
                    </button>

                    &nbsp;

                    <button
                        className="btn btn-secondary"
                        onClick={onDecline}>
                        Decline
                    </button>
                </Box>

            </section>
        </Container>
    );
};

ConsentPage.propTypes = {
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired
};
