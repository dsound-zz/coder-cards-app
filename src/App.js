import React, { Component } from "react";
import { Grid, Header } from "semantic-ui-react";
import Heading from "./components/Heading";
import DecksContainer from "./containers/DecksContainer";
import DeckLayoutContainer from "./containers/DeckLayoutContainer";
import "./App.css";

class App extends Component {
  state = {
    decks: [],
    selectedCards: [],
    selectedDecks: [],
    currentUser: null,
    users: [],
  };

  componentWillMount() {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.REACT_APP_API_URI}/current_user`, {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.errors) {
          } else {
            this.setState({ currentUser: response });
          }
        });
    }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URI}/decks`)
      .then((r) => r.json())
      .then((fetchedDecks) => {
        if (fetchedDecks.errors) {
          alert(fetchedDecks.errors);
        } else {
          this.setState({ decks: fetchedDecks });
          this.fetchDemian();
        }
      });
  }

  fetchDemian = () => {
    fetch(`${process.env.REACT_APP_API_URI}/users/1`)
      .then((r) => r.json())
      .then((userOne) => {
        this.setState({ currentUser: userOne });
        this.filterDecks();
      });
  };

  signup = (username, email, password, passwordConfirmation) => {
    if (password === passwordConfirmation) {
      fetch(`${process.env.REACT_APP_API_URI}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.errors) {
            alert(response.errors);
          } else {
            this.logout();
            localStorage.setItem("token", response.token);
            this.setState({
              currentUser: response,
            });
            alert(`Please login!`);
          }
        });
    } else {
      alert("Passwords do not match!!");
    }
  };

  login = (username, password) => {
    fetch(`${process.env.REACT_APP_API_URI}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.errors) {
          alert(response.errors);
        } else {
          localStorage.setItem("token", response.token);
          this.setState({
            currentUser: response.user,
          });
          this.filterDecks();
          this.setState({
            selectedCards: [],
          });
        }
      });
  };

  logout = () => {
    localStorage.clear();
    this.fetchDemian();
    this.setState({
      selectedCards: [],
    });
    this.filterDecks();
  };

  filterDecks = () => {
    if (this.state.currentUser) {
      const filteredDecks = this.state.decks.filter((deck) => {
        return deck.user_id === this.state.currentUser.id;
      });
      this.setState({
        selectedDecks: filteredDecks,
      });
    } else {
      alert("Login or sign up");
    }
  };

  filterCards = (deckId) => {
    const { decks } = this.state;
    this.setState({
      selectedCards: decks.find((deck) => deck.id === deckId).cards,
    });
  };

  createDeck = (deckName = "Deck One") => {
    fetch(`${process.env.REACT_APP_API_URI}/decks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: deckName,
        user_id: this.state.currentUser.id,
      }),
    })
      .then((res) => res.json())
      .then((newDeck) => {
        if (newDeck.errors) {
          alert(newDeck.errors);
        } else {
          this.setState({ decks: [...this.state.decks, newDeck] });
          this.filterDecks();
        }
      });
  };

  createCard = (cardFront, cardBack, deckId) => {
    fetch(`${process.env.REACT_APP_API_URI}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token"),
      },

      body: JSON.stringify({
        front: cardFront,
        back: cardBack,
        deck_id: deckId,
      }),
    })
      .then((res) => res.json())
      .then((newCard) => {
        if (newCard.errors) {
          alert(newCard.errors);
        } else {
          this.setState({
            selectedCards: [newCard, ...this.state.selectedCards],
          });
        }
      });
  };

  deleteDeck = (deckId) => {
    fetch(`${process.env.REACT_APP_API_URI}/decks/${deckId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const decksCopy = this.state.decks.slice();
    const foundOldDeckIdx = decksCopy.findIndex((deck) => deck.id === deckId);
    decksCopy.splice(foundOldDeckIdx, 1);
    const cardsCopy = this.state.selectedCards.slice();
    const foundOldCardIdx = cardsCopy.findIndex(
      (card) => card.deck_id === deckId
    );
    cardsCopy.splice(foundOldCardIdx, 1);
    this.setState({ decks: decksCopy, selectedCards: cardsCopy }, () => {
      this.filterDecks();
    });
  };

  editCard = (cardFront, cardBack, deckId, cardId) => {
    fetch(`${process.env.REACT_APP_API_URI}/cards/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        front: cardFront,
        back: cardBack,
        deck_id: deckId,
      }),
    })
      .then((res) => res.json())
      .then((editedCard) => {
        if (editedCard.errors) {
          alert(editedCard.errors);
        } else {
          const cardsCopy = this.state.selectedCards.slice();
          const foundOldCardIdx = cardsCopy.findIndex(
            (card) => card.id === cardId
          );
          cardsCopy.splice(foundOldCardIdx, 1, editedCard);
          const deckCopy = this.state.decks.slice();
          const foundDeckIndex = deckCopy.findIndex(
            (deck) => deck.id === deckId
          );
          deckCopy[foundDeckIndex].cards = cardsCopy;
          this.setState(
            {
              decks: deckCopy,
              selectedCards: cardsCopy,
            },
            () => {
              this.filterDecks();
            }
          );
        }
      });
  };

  deleteCard = (cardId, deckId) => {
    fetch(`${process.env.REACT_APP_API_URI}/cards/${cardId}`, {
      method: "DELETE",
      Authorization: localStorage.getItem("token"),
    });
    const cardsCopy = this.state.selectedCards.slice();
    const foundOldCardIdx = cardsCopy.findIndex((card) => card.id === cardId);
    cardsCopy.splice(foundOldCardIdx, 1);

    const decksCopy = this.state.decks.slice();
    const foundDeckIndex = this.state.decks.findIndex((deck) => {
      return deck.id === deckId;
    });
    decksCopy[foundDeckIndex].cards = cardsCopy;
    this.setState(
      {
        decks: decksCopy,
        selectedCards: cardsCopy,
      },
      () => {
        this.filterDecks();
      }
    );
  };

  render() {
    return (
      <>
        <div className="header">
          <Header textAlign="center">
            <h1
              style={{
                fontSize: "60px",
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              Coder Cards
            </h1>
            <Heading
              signup={this.signup}
              login={this.login}
              createDeck={this.createDeck}
              logout={this.logout}
              selectedDecks={this.state.selectedDecks}
              createCard={this.createCard}
              allCards={this.state.allCards}
              currentUser={this.state.currentUser}
            />
          </Header>
        </div>

        <Grid style={{ margin: "2%" }} divided>
          <Grid.Column width={4}>
            <DecksContainer
              decks={this.state.decks}
              selectedDecks={this.state.selectedDecks}
              filterCards={this.filterCards}
              deleteDeck={this.deleteDeck}
              currentUser={this.state.currentUser}
            />
          </Grid.Column>
          <Grid.Column width={12} className="container">
            <DeckLayoutContainer
              selectedCards={this.state.selectedCards}
              selectedDecks={this.state.selectedDecks}
              editCard={this.editCard}
              deleteCard={this.deleteCard}
              currentUser={this.state.currentUser}
            />
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default App;
