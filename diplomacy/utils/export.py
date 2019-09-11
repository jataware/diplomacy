# ==============================================================================
# Copyright (C) 2019 - Philip Paquette, Steven Bocco
#
#  This program is free software: you can redistribute it and/or modify it under
#  the terms of the GNU Affero General Public License as published by the Free
#  Software Foundation, either version 3 of the License, or (at your option) any
#  later version.
#
#  This program is distributed in the hope that it will be useful, but WITHOUT
#  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
#  FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
#  details.
#
#  You should have received a copy of the GNU Affero General Public License along
#  with this program.  If not, see <https://www.gnu.org/licenses/>.
# ==============================================================================
""" Exporter
    - Responsible for exporting games in a standardized format to disk
"""
from diplomacy.engine.game import Game
from diplomacy.engine.map import Map
from diplomacy.utils.game_phase_data import GamePhaseData

# Constants
RULES_TO_SKIP = ['SOLITAIRE', 'NO_DEADLINE', 'CD_DUMMIES', 'ALWAYS_WAIT', 'IGNORE_ERRORS']

def to_saved_game_format(game):
    """ Converts a game to a standardized JSON format

        :param game: game to convert.
        :return: A game in the standard format used to saved game, that can be converted to JSON for serialization
        :type game: diplomacy.engine.game.Game
        :rtype: Dict
    """

    # Get phase history.
    phases = Game.get_phase_history(game)
    # Add current game phase.
    phases.append(Game.get_phase_data(game))
    # Filter rules.
    rules = [rule for rule in game.rules if rule not in RULES_TO_SKIP]
    # Extend states fields.
    phases_to_dict = [phase.to_dict() for phase in phases]
    for phase_dct in phases_to_dict:
        phase_dct['state']['game_id'] = game.game_id
        phase_dct['state']['map'] = game.map_name
        phase_dct['state']['rules'] = rules

    # Building saved game
    return {'id': game.game_id,
            'map': game.map_name,
            'rules': rules,
            'phases': phases_to_dict}

def is_valid_saved_game(saved_game):
    """ Checks if the saved game is valid.
        This is an expensive operation because it replays the game.

        :param saved_game: The saved game (from to_saved_game_format)
        :return: A boolean that indicates if the game is valid
    """
    # pylint: disable=too-many-return-statements, too-many-nested-blocks, too-many-branches
    nb_forced_phases = 0
    max_nb_forced_phases = 1 if 'DIFFERENT_ADJUDICATION' in saved_game.get('rules', []) else 0

    # Validating default fields
    if 'id' not in saved_game or not saved_game['id']:
        return False
    if 'map' not in saved_game:
        return False
    map_object = Map(saved_game['map'])
    if map_object.name != saved_game['map']:
        return False
    if 'rules' not in saved_game:
        return False
    if 'phases' not in saved_game:
        return False

    # Validating each phase
    nb_messages = 0
    nb_phases = len(saved_game['phases'])
    last_time_sent = -1
    for phase_ix in range(nb_phases):
        current_phase = saved_game['phases'][phase_ix]
        state = current_phase['state']
        phase_orders = current_phase['orders']
        previous_phase_name = 'FORMING' if phase_ix == 0 else saved_game['phases'][phase_ix - 1]['name']
        next_phase_name = 'COMPLETED' if phase_ix == nb_phases - 1 else saved_game['phases'][phase_ix + 1]['name']
        power_names = list(state['units'].keys())

        # Validating messages
        for message in saved_game['phases'][phase_ix]['messages']:
            nb_messages += 1
            if map_object.compare_phases(previous_phase_name, message['phase']) >= 0:
                return False
            if map_object.compare_phases(message['phase'], next_phase_name) > 0:
                return False
            if message['sender'] not in power_names + ['SYSTEM']:
                return False
            if message['recipient'] not in power_names + ['GLOBAL']:
                return False
            if message['time_sent'] < last_time_sent:
                return False
            last_time_sent = message['time_sent']

        # Validating phase
        if phase_ix < (nb_phases - 1):
            is_forced_phase = False

            # Setting game state
            game = Game(saved_game['id'], map_name=saved_game['map'], rules=['SOLITAIRE'] + saved_game['rules'])
            game.set_phase_data(GamePhaseData.from_dict(current_phase))

            # Determining what phase we should expect from the dataset.
            next_state = saved_game['phases'][phase_ix + 1]['state']

            # Setting orders
            game.clear_orders()
            for power_name in phase_orders:
                game.set_orders(power_name, phase_orders[power_name])

            # Validating orders
            orders = game.get_orders()
            possible_orders = game.get_all_possible_orders()
            for power_name in orders:
                if sorted(orders[power_name]) != sorted(current_phase['orders'][power_name]):
                    return False
                if 'NO_CHECK' not in game.rules:
                    for order in orders[power_name]:
                        loc = order.split()[1]
                        if order not in possible_orders[loc]:
                            return False

            # Validating resulting state
            game.process()

            # Checking phase name
            if game.get_current_phase() != next_state['name']:
                is_forced_phase = True

            # Checking zobrist hash
            if game.get_hash() != next_state['zobrist_hash']:
                is_forced_phase = True

            # Checking units
            units = game.get_units()
            for power_name in units:
                if sorted(units[power_name]) != sorted(next_state['units'][power_name]):
                    is_forced_phase = True

            # Checking centers
            centers = game.get_centers()
            for power_name in centers:
                if sorted(centers[power_name]) != sorted(next_state['centers'][power_name]):
                    is_forced_phase = True

            # Allowing 1 forced phase if DIFFERENT_ADJUDICATION is in rule
            if is_forced_phase:
                nb_forced_phases += 1
            if nb_forced_phases > max_nb_forced_phases:
                return False

    # Making sure NO_PRESS is not set
    if 'NO_PRESS' in saved_game['rules'] and nb_messages > 0:
        return False

    # The data is valid
    return True
