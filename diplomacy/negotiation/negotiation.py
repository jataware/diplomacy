

import json
import pkg_resources
import requests
from diplomacy.engine.message import Message


# Load Name2Token lookup reference.
LOOKUP_REF = json.loads(pkg_resources.resource_stream(__name__, 'reference.json').read().decode())


def pressgloss(message_obj: Message) -> Message:
    """
    Description
    -----------
    Add DAIDE syntax to message.daide and pressgloss to message.message

    Returns
    -------
    The modified Message as a string.


    """

    negotiation = json.loads(message_obj.negotiation)

    message_obj.daide = to_daide(negotiation, message_obj.sender, message_obj.recipient)

    if 'tones' in negotiation:
        tones = [tone.lower() for tone in negotiation['tones']]
    else:
        tones = ["haughty","urgent"]

    # str = "FRM (FRA) (ENG) (PRP (XDO ((ENG AMY LVP) HLD)))"

    message_obj.message = to_tens(message_obj.daide, tones)
    message_dict = message_obj.to_dict()
    message_string = json.dumps(message_dict)
    return message_string

def to_daide(negotiation: dict, sender: str, recipient: str):
    """
    Description
    -----------
    Convert UI form data to DAIDE syntax.

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

    # Initialize the daide string with FROM TO e.g. FRM (FRA) (ENG) 
    daide = f'FRM ({LOOKUP_REF[sender.lower()]}) ({LOOKUP_REF[recipient.lower()]}) '

    # Process actors and targets to tokens.

    actors  = ' '.join([*map(LOOKUP_REF.get, negotiation['actors'])])
    targets = ' '.join([*map(LOOKUP_REF.get, negotiation['targets'])])

    # Build DAIDE based on the root negotiation action.
    action = str(negotiation['action']).lower()   
    if 'alliance' in action:
        daide = daide + f'(PRP (ALY ({actors}) VSS ({targets})))'

    elif 'dmz' in action:
        pass

    elif 'draw' in action:
        if len(actors) > 0:
            daide = daide + f'(PRP (DRW))'
        else:
            daide = daide + f'(PRP (DRW ({actors})))'

    elif 'order' in action:
        pass

    elif 'peace' in action:
        daide = daide + f'(PRP (PCE ({actors})))'

    elif 'solo' in action:
        daide = daide + f'(PRP (SLO ({actors})))'

    # Handle action modifiers.
    if 'notify' in action:
        # Add FCT to arrangement.
        daide = f"{daide.replace('PRP', 'PRP (FCT')})"

    if 'oppose' in action:
        # Add NOT to arrangement.
        daide = f"{daide.replace('PRP', 'PRP (NOT')})"

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

    endpoint = "http://127.0.0.1:5000/daide2gloss"
    request_json = {"daidetext": daide_text, "tones": tones}

    try:
        req = requests.post(endpoint, json=request_json)

        if "gloss" in req.json():
            return req.json()["gloss"]
        else:
            return None

    except Exception as e:
        print(e)
