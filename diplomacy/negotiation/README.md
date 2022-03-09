## Changes



### message.py

Modified the [model](../engine/message.py#L70) and [__init__](../engine/message.py#L89) to add additional fields sent from the UI:

- `gloss`: bool, if False the message is sent to the recipient
- `daide`: str, DAIDE syntax string
- `negotiation`: json string
- `tones`: comma-delmited string of capitalized tones

```
'“negotiation”: 
    {
        “actors”       : [“France”, “Italy],
        “targets”      : [“Russia”, “Turkey”],
        “action”       : “Propose alliance”,
        "order"        : ""
        “tones”        : [“Haughty”],
        "startLocation": ""
        "endLocation"  : "",
        "response      : "No",
        "gloss"        : true
        
    }'
```

### request_managers.py

Modified [on_send_game_message](../../diplomacy/server/request_managers.py#L826) to add logic based on `Message.gloss` (gloss_only).

- `gloss==True`: DAIDE syntax is created and a TENS message is generated via the Pressgloss API. The message is *not* sent to the recipient power. The `Message` obj is returned as a json string in the `response`.

- `gloss==False`: DAIDE syntax is created and a TENS message is generated via the Pressgloss API. The `Message` message text is set to the returned TENS/Press gloss message, and the Message obj proceeds to the original `on_send_game_message` code to the recipient power.

