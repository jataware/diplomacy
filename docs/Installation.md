## Installation

### Pressgloss API

Installation requires that the [Pressgloss API](https://github.com/jpowersdevtech/pressgloss) be installed as a git submodule in {reponame}/pressgloss.

### Docker

Launch the diplomacy UI, server and pressgloss api:

```docker-compose up –build```

This will create three docker containers:

| Name           | Port |
|----------------|------|
diplomacy_ui     | 3000 |
diplomacy_server | 8642 |
pressgloss api   | 5000 |

Browse to [localhost:3000](http://localhost:3000) to login into the Web UI. Entering a new `username` / `password` will create a new account.
