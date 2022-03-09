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
import React, { useEffect } from "react";
// import PropTypes from "prop-types";

// export class Tab extends React.Component {
//     render() {
//         const style = {
//             display: this.props.display ? 'block' : 'none'
//         };
//         const id = this.props.id ? {id: this.props.id} : {};
//         if (!this.props.display) {
//             return null;
//         }

//         return (
//             <div className={'tab mb-4 ' + this.props.className} style={style} {...id}>
//                 {this.props.children}
//             </div>
//         );
//     }
// }

export const Tab = ({
    // eslint-disable-next-line react/prop-types
    display = false, className = '', id = '', children, onTabView, tabHighlights
}) => {
    useEffect(() => {
        // only call this when the tab comes into view
        if (display && onTabView) {
            // and only call our function if there are highlights
            if (tabHighlights > 0) {
                onTabView();
            }
        }
    }, [display, onTabView, tabHighlights]);

    // we need to keep this around to avoid some funky attributes that would be just numbers
    const divId = id ? {id: id} : {};

    // fully unmount the component when it isn't in view
    if (!display) {
        return null;
    }

    return (
        <div className={'tab mb-4 ' + className} {...divId}>
            {children}
        </div>
    );
};
