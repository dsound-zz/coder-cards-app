import React, { Component } from 'react';
import { Icon, Modal, Form, Confirm, } from 'semantic-ui-react';

// render cards here 

class DeckLayout extends Component {

  state = {
    open: false,
    isFlipped: false,
    modalOpen: false,
    deckName: '',
    cardFront: this.props.card.front,
    cardBack: this.props.card.back,
    deckId: '',
  };


  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  show = () => this.setState({ open: true })

  handleConfirm = () => {
    const foundDeck = this.props.selectedDecks.find(deck => deck.id === this.props.card.deck_id)
    this.props.deleteCard(this.props.card.id, foundDeck.id)
    this.setState({ open: false })
  };

  handleCancel = () => this.setState({ open: false })


  showBack = () => {
    this.setState({
      isFlipped: true
    });
  };

  showFront = () => {
    this.setState({
      isFlipped: false
    });
  };

  handleClick = () => { 
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }))
  }


  handleKeyDown = (e) => {
    if (this.state.isFlipped && e.keyCode === 27) {
      this.showFront();
    }
  };


  submitEditCard = (e) => {
    e.preventDefault()
    this.handleClose()
    this.props.editCard(this.state.cardFront, this.state.cardBack, this.state.deckId, this.props.card.id)
  };

  // handleDeleteCard = () => {
  // };

  render() { 
    const { isFlipped } = this.state;
    return (
      <>
        {this.props.currentUser && this.props.currentUser.id !== 1 ? (
          <div>
            <Icon
              name="edit"
              value="edit"
              color="grey"
              size="small"
              onClick={() => this.handleOpen(this.props.card.id)}
            />
            <Icon name="delete" color="grey" size="small" onClick={this.show} />{" "}
          </div>
        ) : null}
        <Confirm
          open={this.state.open}
          content="Are you sure you want to delete this card?"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
        <div className="flex-container">
         
            <div className="scene scene--card">
              <div
           
                onClick={() => this.handleClick()}
                className={isFlipped ? "card is-flipped" : "card"}
              >
                <div className="card__face card__face--front">
                  <div>
                    <h2>{this.props.card.front}</h2>
                  </div>
                </div>
                <div className="card__face card__face--back">
                  <div>
                    <h4>{this.props.card.back}</h4>
                  </div>
                </div>
              </div>
            </div>
        
        </div>

        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="medium"
        >
          <Modal.Content>
            <Form onSubmit={this.submitEditCard}>
              <Form.Input
                fluid
                placeholder="card front"
                value={this.state.cardFront}
                onChange={this.handleChange}
                name="cardFront"
                required
              />
              <Form.TextArea
                fluid
                placeholder="card back"
                value={this.state.cardBack}
                onChange={this.handleChange}
                name="cardBack"
                required
              />
              <Form.Select
                fluid
                onChange={this.handleChange}
                placeholder={this.props.selectedDecks.map((deck) => deck.name )}
                label="deck"
                name="deckId"
                size={4}
                selection
                options={
                  this.props.selectedDecks
                    ? this.props.selectedDecks.map((deck) => ({
                        name: deck.name,
                        key: deck.id,
                        value: deck.id,
                        text: deck.name,
                      }))
                    : []
                }
              />

              <Form.Button type="submit" color="teal">
                Submit Edit
              </Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
      </>
    );
  };
};
export default DeckLayout;

