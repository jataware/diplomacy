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
import {Forms} from "../components/forms";
import {UTILS} from "../../diplomacy/utils/utils";
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
    }

    gloss = false;

    static orders=["move", "hold", "support_hold", "support_move", "convoy", "build"];

    static tones=["Haughty", "Objective", "Obsequious", "Relaxed", "Urgent"];

    static locations=["MOS", "PAR", "BER", "LON", "ROM", "CON"]

    static countries=[
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
        return {selectedAction: 'order',
                selectedOrder: 'move',
                selectedCountries: {},
                targets: {},
                actors: {},
                selectedTones: {}
                };
    }

    onValueChange(event) {
        event.persist();
        console.log('Option event: ', event, "POWERS: ", this.props.powers);
        this.setState(prevState => ({
            selectedAction: event.target.value,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
            selectedTones: prevState.selectedTones,
        }));
    }

    onOrderChange(event) {
        event.persist();
        console.log('Order event: ', event);
        this.setState(prevState => ({
            selectedAction: prevState.selectedAction,
            selectedOrder: event.target.value,
            selectedCountries: prevState.selectedCountries,
            selectedTones: prevState.selectedTones,
        }));
    }

    checkboxOnChange(event) {
        event.persist();
        console.log('Checkbox event: ', event);
        const {id, checked} = event.target;
        console.log('ID: ', id, 'Checked: ', checked);
        const updatedCountry = this.state.selectedCountries[id] = checked;
        this.setState(prevState => ({
            //checked: !prevState.checked
            selectedAction: prevState.selectedAction,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: { ...prevState.selectedCountries, updatedCountry },
            selectedTones: prevState.selectedTones,
        }));
    }

    tonesOnChange(event) {
        event.persist();
        console.log('Tones event: ', event);
        const {tone, checked} = event.target;
        console.log('ID: ', tone, 'Checked: ', checked);
        const updatedTones = this.state.selectedTones[tone] = checked;
        this.setState(prevState => ({
            selectedAction: prevState.selectedAction,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
            selectedTones: { ...prevState.selectedTones, updatedTones },
        }));
    }

    onGlossSubmit(event) {
        event.preventDefault();
        console.log("initial state: ", this.state);
        let actorHolder = [];
        for (let country in this.state.selectedCountries){
            if (!country === "updatedCountry"){
                actorHolder.push(country);
            }
        }
        let targetHolder = [];
        if(this.state.selectedAction === "alliance"){
            for (let country in this.state.selectedCountries){
                if (!country === "updatedCountry"){
                    targetHolder.push(country);
                }
            }
        }
        MessageForm.gloss = true;
        const message = {
            action: this.state.selectedAction,
            order: this.state.selectedOrder,
            actors: actorHolder,
            targets: targetHolder,
            tones: this.selectedTones,
            gloss: true,
        };
        if (this.props.onSubmit){
            this.props.onSubmit({negotiation: JSON.stringify(message),
                                message: '',
                                daide: '',
                                gloss: true});
        }
        setTimeout( () => {console.log(`State:`, this.state)});
        console.log(`Final Gloss Event:`, event);
    }

    onFinalSubmit(event) {
        event.preventDefault();
        console.log("initial state: ", this.state);
        let actorHolder = [];
        for (let country in this.state.selectedCountries){
            if (!country === "updatedCountry"){
                actorHolder.push(country);
            }
        }
        let targetHolder = [];
        if(this.state.selectedAction === "alliance"){
            for (let country in this.state.selectedCountries){
                if (!country === "updatedCountry"){
                    targetHolder.push(country);
                }
            }
        }
        const message = {
            action: this.state.selectedAction,
            order: this.state.selectedOrder,
            actors: actorHolder,
            targets: targetHolder,
            tones: this.selectedTones,
            gloss: false,
        };
        console.log('Inside the setState: ', this.state);
        if (this.props.onSubmit){
            this.props.onSubmit({negotiation: JSON.stringify(message),
                                message: '',
                                daide: '',
                                gloss: false});
        }
        this.setState(this.initState());
        MessageForm.gloss = false;
        setTimeout( () => {console.log(`State:`, this.state)});
        console.log(`Final Submit Event:`, event);
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
                        </select>
                    </div>
                    {this.state.selectedAction === "propose_order" ? 
                        <div className={'form-group col-md-6'}>
                            {MessageForm.orders.map((orderType, index) => {
                                return(
                                    <li key={index}>
                                        <input className={'form-input__input'} key={`${orderType}-button`} type={'radio'}
                                         name={`order_${orderType}`} value={`${orderType}`} checked={this.state.selectedOrder === `${orderType}`}
                                         id={`${orderType}-button`} onChange={this.onOrderChange}/>
                                        <label className="form-input__label" htmlFor="${orderType}-button">{orderType}</label>
                                    </li>
                                );
                            })}
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
                </div>
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
                {MessageForm.gloss &&
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
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};
