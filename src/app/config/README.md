Each layer (business, destination currently) of the database has a config collection that can
have different documents divided by role. This way, API keys stored in the server are never exposed
to the client and load times are kept to only when needs to come down.

Overrides occur as expected with rules in the destination overwriting rules in the business etc...
