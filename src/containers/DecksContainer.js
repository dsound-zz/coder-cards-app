import React from 'react';
import DeckCards from '../components/DeckCards'

const DecksContainer = props => {
    
    return (
        <div>
            {props.selectedDecks && props.selectedDecks.map((deck, idx) => {
            return <DeckCards key={idx} deck={deck}
            deleteDeck={props.deleteDeck} currentUser={props.currentUser} filterCards={props.filterCards}/>
        })
    }
        </div>
    )
}

export default DecksContainer 