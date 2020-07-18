import React, { Component } from 'react';
import { Card, Icon, Confirm } from 'semantic-ui-react';

// render deck here

class DeckCards extends Component {

    state = {
        open: false,
        deckId: ''
    }

    show = (deckId) => this.setState({ open: true, deckId: deckId })

    handleConfirm = () => {
        this.setState({ open: false })
        this.props.deleteDeck(this.props.deck.id)
    }

    handleCancel = () => this.setState({ open: false })


    render() {

        return (
            <Card>
                <Card.Content id='deck'
                    onClick={() => this.props.filterCards(this.props.deck.id)}>
                    <h4>{this.props.deck && this.props.deck.name}</h4>
                </Card.Content>
                {this.props.currentUser.id !== 1 ? <Icon name='delete' size='small' onClick={this.show}></Icon> : null}
                <Confirm
                    open={this.state.open}
                    content='Are you sure you want to delete this deck?'
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm}
                />
            </Card>
        );
    };
};

export default DeckCards;