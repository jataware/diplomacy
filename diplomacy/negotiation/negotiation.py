

import json
import pkg_resources
import requests
from diplomacy.engine.message import Message


# Load Name2Token lookup reference.
LOOKUP_REF = json.loads(pkg_resources.resource_stream(__name__, 'reference.json').read().decode())


def build_daide(daide, negotiation, message_daide):

    # Process actors and targets to tokens.
    actors  = ' '.join([*map(LOOKUP_REF.get, negotiation['actors'])])
    targets = ' '.join([*map(LOOKUP_REF.get, negotiation['targets'])])

    # Build DAIDE based on the root negotiation action.
    action = str(negotiation['action']).lower() 
    if 'alliance' in action:
        # Level 10 ALY
        daide = daide + f'(PRP (ALY ({actors}) VSS ({targets})))'

    elif 'dmz' in action:
        # Level 20 DMZ
        pass

    elif 'draw' in action:
        # Level 10 DRW
        if len(actors) > 0:
            daide = daide + f'(PRP (DRW))'
        else:
            daide = daide + f'(PRP (DRW ({actors})))'
        
    elif 'order' in action:
        # Level 20 XRD
        # move, hold, support move, support hold, convoy
        # An XDO arrangement applies to the next turn in which the order type is valid – so the next movement turn for a HLD, MTO,
        # SUP, CVY or CTO order, the next retreat turn for a RTO or DSB order, and the next adjustment turn for a BLD, REM or WVE
        # order.
            
        # diplomacy/web/src/gui/utils/order_building.js LN 141 single letters lookup to DAIDE.

        # Process order components.
        order          = negotiation['order']         if 'order'         in negotiation else None
        end_location   = negotiation['endLocation']   if 'endLocation'   in negotiation else None
        start_location = negotiation['startLocation'] if 'startLocation' in negotiation else None
        
        # Hardcoding while developing
        unit  = 'AMY'
        order = 'MTO'
        actor = 'ENG'
        if not end_location:
            end_location = 'ADR'
            start_location = 'EDI'

        daide = daide + f'(PRP (XDO ( ({actor} {unit} {start_location}) {order} {end_location})))'

    elif 'peace' in action:
        # Level 10 PCE
        daide = daide + f'(PRP (PCE ({actors})))'

    elif 'solo' in action:
        # Level 10 SLO
        daide = daide + f'(PRP (SLO ({actors})))'

    elif 'response' in action:
        # Level 10 YES response
        # Level 10 REJ response
        # Level 10 BSW response

        # message_daide: FRM (AUS) (ITA) (PRP (ALY (ITA) VSS (GER)))
        print(message_daide)

        # no: REJ, noyb: BWX, default to yes
        response = str(negotiation['response']).lower()
        if response == 'no':
            response = 'REJ'
        elif response == 'noyb':
            response = 'BWX'
        else:
            response = 'YES' 
        print(response)

        daide = daide + f'({response} ({message_daide}))'
        print(daide)

    # Handle action modifiers.
    if 'notify' in action:
        # Add FCT to arrangement.
        daide = f"{daide.replace('PRP', 'PRP (FCT')})"

    if 'oppose' in action:
        # Add NOT to arrangement.
        daide = f"{daide.replace('PRP', 'PRP (NOT')})"

    return daide

def get_message_daide(message_history, messages, sender, recipient):
    # messages are current; message_history loaded from json db.
    # So check messages, then message_history for the latest.

    # messages is a StructuredDict
    for message in messages.reversed_values():               
        if (message.recipient == sender and message.sender == recipient):
            # Last message between these powers.
            # message.daide: FRM (AUS) (ITA) (PRP (ALY (ITA) VSS (GER)))
            
            # Leave only PRP or FCT ...
            # Split after 3rd (.
            proposal = message.daide.split('(')[3:]
            # Rejoin array with ( and remove trailng ).
            return '('.join(proposal)[:-1]

    # message_history is a StructuredDict of StructuredDict
    for phase_message_history in message_history.reversed_values():
        for message in phase_message_history.reversed_values():
            if (message.recipient == sender and message.sender == recipient):
                # Last message between these powers.
                # message.daide: FRM (AUS) (ITA) (PRP (ALY (ITA) VSS (GER)))
                
                # Leave only PRP or FCT ...
                # Split after 3rd (.
                proposal = message.daide.split('(')[3:]
                # Rejoin array with ( and remove trailng ).
                return '('.join(proposal)[:-1]
    
    return None

def pressgloss(message_obj: Message, message_history, messages, return_message_obj_str: bool = True):
    """
    Description
    -----------
    Add DAIDE syntax to message.daide and pressgloss to message.message

    Parameters
    ----------
    message_obj: Message
        The Message to modify.

    return_message_obj: bool = True
        Return the Message object as a json string (for press gloss), 
        or the tens/glossed message text string (send message).

    Returns
    -------
        The Message object as a json string (for press gloss), 
        or the tens/glossed message text string (send message).

    """

    # Convert the Message object negotation str to a dict.
    negotiation = json.loads(message_obj.negotiation)

    # Convert the message to DAIDE.
    message_obj.daide = to_daide(negotiation, message_obj.sender, message_obj.recipient, message_history, messages)

    # Backwards compatible massaging of the tones.
    if 'tones' in negotiation:
        tones = [tone.lower().capitalize() for tone in negotiation['tones']]
    else:
        tones = ["Haughty","Urgent"]

    
    # Set the message_obj message to the TENS message created by the Pressgloss API.
    message_obj.message = to_tens(message_obj.daide, tones)

    # If return_message_obj_str == True, then the entire Message object json 
    # is returned as a string.
    if return_message_obj_str:
        message_dict = message_obj.to_dict()
        message_string = json.dumps(message_dict)
        return message_string
    else:
        # Return only the generated Pressgloss text.
        return message_obj.message

def to_daide(negotiation: dict, sender: str, recipient: str, message_history, messages):
    """
    Description
    -----------
    Convert UI form data to DAIDE syntax e.g. "FRM (FRA) (ENG) (PRP (XDO ((ENG AMY LVP) HLD)))"

    The UI uses a discreet list of available orders.

    Uses Message.negotiation which is a json string:
        “negotiation”: 
        {
            “actors”: [“France”, “Italy],
            “targets”: [“Russia”, “Turkey”],
            “action”: “Propose alliance”,
            “tones” : [“Haughty”]
        }

    """

    # Filter for messages between these powers.
    # Maybe check for action == reponse first.
    action = str(negotiation['action']).lower() 
    if action == 'response':
        message_daide = get_message_daide(message_history, messages, sender, recipient)
    else:
        message_daide = None

    # Initialize the daide string with FROM TO e.g. FRM (FRA) (ENG) 
    daide = f'FRM ({LOOKUP_REF[sender.lower()]}) ({LOOKUP_REF[recipient.lower()]}) '  
    daide = build_daide(daide, negotiation, message_daide)
    
    return daide

def to_tens(daide_text, tones):
    """
    Description
    -----------
    Pass DAIDE syntax to the pressgloss API to return 
    Tone-ENhanced Syntax

    Parameters
    ----------
    daide_text: str
        DAIDE syntax to pass to the pressgloss API.

    tones: list[str]
        Optional tones.

    """

    #endpoint = "http://pressgloss:5000/daide2gloss"
    endpoint = "http://172.17.0.2:5000/daide2gloss"
    request_json = {"daidetext": daide_text, "tones": tones}

    try:
        req = requests.post(endpoint, json=request_json)

        if "gloss" in req.json():
            return req.json()["gloss"]
        else:
            return None

    except Exception as e:
        print(e)
