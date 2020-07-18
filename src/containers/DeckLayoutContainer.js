import React from 'react';
import DeckLayout from '../components/DeckLayout';

const DeckLayoutContainer = props => {
   
    return (
        <div>
            {props.selectedCards && props.selectedCards.map((card, idx) => {
                return <DeckLayout key={idx} card={card} editCard={props.editCard} selectedDecks={props.selectedDecks}
                deleteCard={props.deleteCard}  currentUser={props.currentUser} />
            })
        }
        </div>
        
    );
};

export default DeckLayoutContainer 