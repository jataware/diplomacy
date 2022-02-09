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
    }

    static orders=["move", "support_hold", "support_move", "convoy", "build"]

    static countries=[
        {
            id: "eng",
            name: "England"
        },
        {
            id:"rus",
            name: "Russia"
        },
        {
            id: "fra",
            name: "France"
        }
    ];

    initState() {
        return {selectedOption: 'order',
                selectedOrder: 'move',
                selectedCountries: {eng: false,
                    rus: false,
                    fra: false},
                };
    }

    onValueChange(event) {
        event.persist();
        console.log('My Button event: ', event);
        this.setState(prevState => ({
            selectedOption: event.target.value,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: prevState.selectedCountries,
        }));
    }

    onOrderChange(event) {
        event.persist();
        console.log('My Order event: ', event);
        this.setState(prevState => ({
            selectedOption: prevState.selectedOption,
            selectedOrder: event.target.value,
            selectedCountries: prevState.selectedCountries,
        }));
    }

    checkboxOnChange(event) {
        event.persist();
        console.log('Checkbox event: ', event);
        const {id, checked} = event.target;
        console.log('ID: ', id, 'Checked: ', checked)
        const updatedCountry = this.state.selectedCountries[id] = checked;
        this.setState(prevState => ({
            //checked: !prevState.checked
            selectedOption: prevState.selectedOption,
            selectedOrder: prevState.selectedOrder,
            selectedCountries: { ...prevState.selectedCountries, updatedCountry },
        }));
    }

    onGlossSubmit(event) {

    }

    onFinalSubmit(event) {
        event.preventDefault();
        console.log("initial state: ", this.state);
        const message = {
            option: this.state.selectedOption,
            order: this.state.selectedOrder,
            selectedCountries: this.state.selectedCountries
        }
        console.log('Inside the setState: ', this.state);
        if (this.props.onSubmit){
            this.props.onSubmit({message: JSON.stringify(message)});
        }
        this.setState(this.initState());
        setTimeout( () => {console.log(`State:`, this.state)});
        console.log(`Final Submit Event:`, event);
    }

    render() {
        return (
            <form>
                <div className={'form-group row'}>
                    <div className="form-group col-md-6">
                        <input className={'form-input__input'} key={'order'} type={'radio'}
                             name={'negotation_type'} value={'order'} checked={this.state.selectedOption === 'order'}
                             id={'order'} onChange={this.onValueChange}/>
                        <label className="form-input__label" htmlFor="order">Order</label>
                        <input className={'form-input__input'} key={'alliance'} type={'radio'}
                                 name={'negotation_type'} value={'alliance'} checked={this.state.selectedOption === 'alliance'}
                                 id={'alliance'} onChange={this.onValueChange}/>
                        <label className="form-input__label" htmlFor="alliance">Alliance</label>
                        <input className={'form-input__input'} key={'peace'} type={'radio'}
                                 name={'negotation_type'} value={'peace'} checked={this.state.selectedOption === 'peace'}
                                 id={'peace'} onChange={this.onValueChange}/>
                        <label className="form-input__label" htmlFor="peace">Peace</label>
                        <input className={'form-input__input'} key={'draw'} type={'radio'}
                                 name={'negotation_type'} value={'draw'} checked={this.state.selectedOption === 'draw'}
                                 id={'draw'} onChange={this.onValueChange}/>
                        <label className="form-input__label" htmlFor="draw">Draw</label>
                        <input className={'form-input__input'} key={'solo_win'} type={'radio'}
                                 name={'negotation_type'} value={'solo_win'} checked={this.state.selectedOption === 'solo_win'}
                                 id={'solo_win'} onChange={this.onValueChange}/>
                        <label className="form-input__label" htmlFor="solo_win">Solo Win</label>
                    </div>
                    {this.state.selectedOption === "order" ? 
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
                    {this.state.selectedOption === "peace" || this.state.selectedOption === "alliance" ? 
                        <div className={'form-group col-md-6'}>
                            {MessageForm.countries.map(({ id, name }, index) => {
                                return(
                                    <li key={index}>
                                        <input className={'form-input__input'} key={`${id}-check`} type={'checkbox'}
                                         name={`country_${id}`} value={`${id}`} checked={this.state.selectedCountries[id]}
                                         id={`${id}`} onChange={this.checkboxOnChange}/>
                                        <label className="form-input__label" htmlFor="${id}-check">{name}</label>
                                    </li>
                                );
                            })}
                        </div>
                        : null
                    }
                </div>
                {/*<Button type='submit' title="Generate Gloss" onClick={this.onGlossSubmit} pickEvent/>*/}
                <Button type='submit' title="Submit" onClick={this.onFinalSubmit} pickEvent large/>

            </form>
        );
    }
}

MessageForm.propTypes = {
    sender: PropTypes.string,
    recipient: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};
