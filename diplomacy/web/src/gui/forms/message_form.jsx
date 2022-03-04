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
import {ORDER_BUILDER} from "../utils/order_building";
import PropTypes from "prop-types";
import {Button} from "../components/button";


export class MessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        this.onValueChange = this.onValueChange.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);
        this.checkboxOnChange = this.checkboxOnChange.bind(this);
        this.onFinalSubmit = this.onFinalSubmit.bind(this);
        this.onGlossSubmit = this.onGlossSubmit.bind(this);
        this.tonesOnChange = this.tonesOnChange.bind(this);
        this.onResponseChange = this.onResponseChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

static tones = ["Haughty", "Objective", "Obsequious", "Relaxed", "Urgent"];

static locations = ["ADR", "AEG", "ALB", "ANK", "APU", "ARM", "BAL", "BAR", "BEL", "BER", "BLA", "BOH", "BOT", "BRE", "BUD", "BUL", "BUR", "CLY", "CON", "DEN", "EAS", "EDI", "ENG", "FIN", "GAL", "GAS", "GRE", "HEL", "HOL", "ION", "IRI", "KIE", "LON", "LVN", "LVP", "LYO", "MAO", "MAR", "MOS", "MUN", "NAF", "NAO", "NAP", "NTH", "NWG", "NWY", "PAR", "PIC", "PIE", "POR", "PRU", "ROM", "RUH", "RUM", "SER", "SEV", "SIL", "SKA", "SMY", "SPA", "STP", "SWE", "SYR", "TRI", "TUN", "TUS", "TYR", "TYS", "UKR", "VEN", "VIE", "WAL", "WAR", "WES", "YOR"];

static countries = [
    {
        id: "austria",
        name: "Austria"
    },
    {
        id: "england",
        name: "England"
    },
    {
        id: "france",
        name: "France"
    },
    {
        id: "germany",
        name: "Germany"
    },
    {
        id: "italy",
        name: "Italy"
    },
    {
        id:"russia",
        name: "Russia"
    },
    {
        id:"turkey",
        name: "Turkey"
    },
];
    initState() {
        return {
            selectedAction: 'propose_order',
            selectedOrder: 'M',
            startLocation: '',
            endLocation: '',
            selectedCountries: {},
            targets: {},
            actors: {},
            selectedTones: {},
            response: '',
            orderTarget: 'player',
            gloss: true,
        };
    }

    onValueChange(event) {
        event.persist();
        this.setState(prevState => ({
            selectedAction: event.target.value,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
            selectedTones: prevState.selectedTones,
            targets: prevState.targets,
            response: prevState.response,
        }));
    }

    onResponseChange(event) {
        event.persist();
        this.setState(prevState => ({
            selectedAction: prevState.selectedAction,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
            selectedTones: prevState.selectedTones,
            targets: prevState.targets,
            response: event.target.value,
        }));
    }

    onOrderChange(event) {
        event.persist();
        this.setState(prevState => ({
            selectedAction: prevState.selectedAction,
            selectedOrder: event.target.value,
            selectedCountries: prevState.selectedCountries,
            selectedTones: prevState.selectedTones,
            targets: prevState.targets,
            response: prevState.response,
        }));
    }

    onSelectChange(event) {
        event.persist();
        const id = event.target.id;
        const value = event.target.value;
        let locationReturn = {};
        locationReturn[id] = value; 
        setTimeout( () => this.setState( locationReturn ));
    }

    checkboxOnChange(event) {
        event.persist();
        const {id, checked} = event.target;
        if (id.includes('target_')) {
            const updatedTarget = this.state.targets[id.replace('target_', '')] = checked;
            this.setState(prevState => ({
                //checked: !prevState.checked
                selectedAction: prevState.selectedAction,
                selectedOrder: prevState.selectedOrder,
                selectedCountries: prevState.selectedCountries,
                targets: { ...prevState.targets, updatedTarget },
                selectedTones: prevState.selectedTones,
                response: prevState.response,
            }));

            //TODO: reduce the above into one line and get rid of the direct state setting
            // this.setState((prevState) => ({ ...prevState, targets: {...prevState.targets, }}))
        }
        else{
            const updatedCountry = this.state.selectedCountries[id] = checked;
            this.setState(prevState => ({
                //checked: !prevState.checked
                selectedAction: prevState.selectedAction,
                selectedOrder: prevState.selectedOrder,
                selectedCountries: { ...prevState.selectedCountries, updatedCountry },
                selectedTones: prevState.selectedTones,
                targets: prevState.targets,
                response: prevState.response,
            }));
        }
        
    }

    tonesOnChange(event) {
        event.persist();
        const {id, checked} = event.target;
        const updatedTones = this.state.selectedTones[id] = checked;
        this.setState(prevState => ({
            selectedAction: prevState.selectedAction,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
            selectedTones: { ...prevState.selectedTones, updatedTones },
            targets: prevState.targets,
            response: prevState.response,
        }));
    }

    onGlossSubmit(event) {
        event.preventDefault();
        let actorHolder = [];
        for (let country in this.state.selectedCountries){
            if (!(country === "updatedCountry")){
                if(this.state.selectedCountries[country]){
                    actorHolder.push(country);
                }
            }
        }
        let targetHolder = [];
        if(this.state.selectedAction === "propose_alliance"){
            for (let country in this.state.targets){
                if (!(country === "updatedTarget")){
                    if(this.state.targets[country]){
                        targetHolder.push(country);
                    }
                }
            }
        }
        let toneHolder = [];
        for (let tone in this.state.selectedTones){
            if (!(tone === "updatedTones")){
                if(this.state.selectedTones[tone]){
                    toneHolder.push(tone);
                }
            }
        }
        this.setState({ gloss: true });
        const message = {
            action: this.state.selectedAction,
            order: this.state.selectedOrder,
            orderTarget: this.state.orderTarget,
            startLocation: this.state.startLocation,
            endLocation: this.state.endLocation,
            actors: actorHolder,
            targets: targetHolder,
            tones: toneHolder,
            response: this.state.response,
            gloss: true,
        };
        if (this.props.onSubmit){
            this.props.onSubmit({negotiation: JSON.stringify(message),
                                message: '',
                                daide: '',
                                gloss: true});
        }
        setTimeout( () => {console.log(`State:`, this.state)});
    }

    onFinalSubmit(event) {
        event.preventDefault();
        let actorHolder = [];
        for (let country in this.state.selectedCountries){
            if (!(country === "updatedCountry")){
                if(this.state.selectedCountries[country]){
                    actorHolder.push(country);
                }
            }
        }
        let targetHolder = [];
        if(this.state.selectedAction === "propose_alliance"){
            for (let country in this.state.targets){
                if (!(country === "updatedTarget")){
                    if(this.state.targets[country]){
                        targetHolder.push(country);
                    }
                }
            }
        }
        let toneHolder = [];
        for (let tone in this.state.selectedTones){
            if (!(tone === "updatedTones")){
                if(this.state.selectedTones[tone]){
                    toneHolder.push(tone);
                }
            }
        }
        const message = {
            action: this.state.selectedAction,
            order: this.state.selectedOrder,
            orderTarget: this.state.orderTarget,
            startLocation: this.state.startLocation,
            endLocation: this.state.endLocation,
            actors: actorHolder,
            targets: targetHolder,
            tones: toneHolder,
            response: this.state.response,
            gloss: false,
        };
        if (this.props.onSubmit){
            this.props.onSubmit({negotiation: JSON.stringify(message),
                                message: '',
                                daide: '',
                                gloss: false});
        }
        this.props.onRealSubmit();
        this.setState(this.initState());
    }

    render() {
        return (
            <form>
                <div className={'form-group row'}>
                    <div className="form-group col-md-6">
                        <select id="negotiation_type" value={this.state.selectedAction} onChange={this.onValueChange}>
                            <option value="propose_order">Propose Order</option>
                            <option value="propose_alliance">Propose Alliance</option>
                            <option value="propose_peace">Propose Peace</option>
                            <option value="propose_draw">Propose Draw</option>
                            <option value="propose_solo_win">Propose Solo Win</option>
                            <option value="propose_dmz">Propose Demilitarized Zone</option>
                            <option value="oppose_peace">Oppose Peace</option>
                            <option value="oppose_order">Oppose Order</option>
                            <option value="oppose_draw">Oppose Draw</option>
                            <option value="oppose_dmz">Oppose Demilitarized Zone</option>
                            <option value="oppose_alliance">Oppose Alliance</option>
                            <option value="notify_peace">Notify about Peace</option>
                            <option value="notify_order">Notify about Order</option>
                            <option value="notify_dmz">Notify about Demilitarized Zone</option>
                            <option value="notify_alliance">Notify about Alliance</option>
                            <option value="cancel">Cancel Previous Proposal</option>
                            <option value="response">Response</option>
                        </select>
                    </div>
                    {this.state.selectedAction === "propose_order" ||
                    this.state.selectedAction === "oppose_order" ||
                    this.state.selectedAction === "notify_order" ? 
                        <div className={'form-group col-md-6'}>
                            <select id="orderTarget" value={this.state.orderTarget} onChange={this.onSelectChange}>
                                <option value="player">Order I can do</option>
                                <option value="recipient">Order they can do</option>
                            </select>
                            {this.state.orderTarget === "player" ?
                                <div>
                                    <h6>Order</h6>
                                    <select id="order_type" value={this.state.selectedOrder} onChange={this.onOrderChange}>
                                        {Object.keys(this.props.senderMoves).map((orderType) => {
                                            return(
                                                <option key={`${orderType}-key`} value={orderType}>{ORDER_BUILDER[orderType].name}</option>
                                            );
                                        })}
                                    </select>
                                    <h6>Start Location</h6>
                                    <select id="startLocation" value={this.state.startLocation} onChange={this.onSelectChange}>
                                        {this.props.senderMoves[this.state.selectedOrder].map((location) => {
                                            return(
                                                <option key={`${location}-key`} value={location}>{location}</option>
                                            );
                                        })}
                                    </select>
                                    <h6>End Location</h6>
                                    <select id="endLocation" value={this.state.endLocation} onChange={this.onSelectChange}>
                                        {MessageForm.locations.map((location) =>{
                                            return(
                                                <option key={`${location}-key`} value={location}>{location}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                :null
                            }
                            {this.state.orderTarget === "recipient" ?
                                <div>
                                    <h6>Order</h6>
                                    <select id="order_type" value={this.state.selectedOrder} onChange={this.onOrderChange}>
                                        {Object.keys(this.props.recipientMoves).map((orderType) => {
                                            return(
                                                <option key={`${orderType}-key`} value={orderType}>{ORDER_BUILDER[orderType].name}</option>
                                            );
                                        })}
                                    </select>
                                    <h6>Start Location</h6>
                                    <select id="startLocation" value={this.state.startLocation} onChange={this.onSelectChange}>
                                        {this.props.recipientMoves[this.state.selectedOrder].map((location) => {
                                            return(
                                                <option key={`${location}-key`} value={location}>{location}</option>
                                            );
                                        })}
                                    </select>
                                    <h6>End Location</h6>
                                    <select id="endLocation" value={this.state.endLocation} onChange={this.onSelectChange}>
                                        {MessageForm.locations.map((location) =>{
                                            return(
                                                <option key={`${location}-key`} value={location}>{location}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                :null
                            }
                        </div>
                        : null
                    }
                    {this.state.selectedAction === "propose_peace" || 
                    this.state.selectedAction === "propose_alliance" || 
                    this.state.selectedAction === "notify_alliance" ||
                    this.state.selectedAction === "notify_peace" ||
                    this.state.selectedAction === "oppose_peace" ||
                    this.state.selectedAction === "oppose_alliance" ? 
                        <div className={'form-group col-md-6'}>
                            <h6>Countries Involved: </h6>
                            {MessageForm.countries.map(({ id, name }, index) => {
                                return(
                                    <li key={index}>
                                        <input className={'form-input__input'} key={`${id}-check`} type={'checkbox'}
                                         name={`country_${id}`} value={`${id}`} checked={this.state.selectedCountries[id]}
                                         id={`${id}`} onChange={this.checkboxOnChange}/>
                                        <label className="form-input__label" htmlFor={`${id}-check`}>{name}</label>
                                    </li>
                                );
                            })}
                        </div>
                        : null
                    }
                    {this.state.selectedAction === "propose_alliance" || 
                    this.state.selectedAction === "notify_alliance" ||
                    this.state.selectedAction === "oppose_alliance" ? 
                        <div className={'form-group col-md-6'}>
                            <h6>Alliance Targets: </h6>
                            {MessageForm.countries.map(({ id, name }, index) => {
                                return(
                                    <li key={index}>
                                        <input className={'form-input__input'} key={`${id}-check`} type={'checkbox'}
                                         name={`target_${id}`} value={`${id}`} checked={this.state.targets[id]}
                                         id={`target_${id}`} onChange={this.checkboxOnChange}/>
                                        <label className="form-input__label" htmlFor={`${id}-check`}>{name}</label>
                                    </li>
                                );
                            })}
                        </div>
                        : null
                    }
                    {this.state.selectedAction === "propose_dmz" ||
                    this.state.selectedAction === "oppose_dmz" ||
                    this.state.selectedAction === "notify_dmz" ?
                        <div className={'form-group col-md-6'}>
                            <select id="dmzLocation" value={this.state.dmzLocation} onChange={this.onSelectChange}>
                                {MessageForm.locations.map((location) =>{
                                    return(
                                        <option key={`${location}-key`} value={location}>{location}</option>
                                    );
                                })}
                            </select>
                        </div>
                        : null
                    }
                </div>
                {this.state.selectedAction === "response" ?
                    <div className={'form-group col-md-6'}>
                        <select id="response_type" value={this.state.response} onChange={this.onResponseChange}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="noyb">None of your business</option>
                        </select>
                    </div>
                    :null
                }

               
                <div className={'form-group col-md-6'}>
                {MessageForm.tones.map(( name, index) => {
                    return(
                        <li key={index}>
                            <input className={'form-input__input'} key={`${name}-tone`} type={'checkbox'}
                             name={`${name}-tone`} value={`${name}`} checked={this.state.selectedTones[name]}
                             id={`${name}`} onChange={this.tonesOnChange}/>
                            <label className="form-input__label" htmlFor={`${name}-tone`}>{name}</label>
                        </li>
                    );
                })}
                </div>
                <Button type='submit' title="Generate Gloss" onClick={this.onGlossSubmit} pickEvent large/>
                {this.state.gloss &&
                    <Button type='submit' title="Submit" onClick={this.onFinalSubmit} pickEvent large/>
                }
                

            </form>
        );
    }
}

MessageForm.propTypes = {
    sender: PropTypes.string,
    recipient: PropTypes.string,
    powers: PropTypes.object,
    senderMoves: PropTypes.object,
    recipientMoves: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onRealSubmit: PropTypes.func,
};
