import React, { Component } from 'react';
import { Modal, Form, Button, Menu } from 'semantic-ui-react';

// configure heading funtinoality 

class Heading extends Component {
    state = {
        modalDeckOpen: false,
        modalCardOpen: false,
        modalSignUpOpen: false,
        modalLoginOpen: false,
        deckName: '',
        cardFront: '',
        cardBack: '',
        deckId: ''
    }

    handleDeckOpen = (e) => {
        if (this.props.currentUser.id !== 1) {
            this.setState({ modalDeckOpen: true })
        } else {
            alert('Sign in or Sign up to make your own decks and cards!')
        };
    };

    handleCardOpen = (e) => {
        if (this.props.currentUser.id !== 1) {
            this.props.selectedDecks.length >= 1 ?
                this.setState({ modalCardOpen: true }) :
                alert('Create a deck frist!')
        } else {
            alert('Sign in or Sign up to make your own decks and cards!')
        };
    };

    handleSignUpOpen = (e) => {
        this.setState({ modalSignUpOpen: true })
    }

    handleLoginOpen = (e) => {
        this.setState({ modalLoginOpen: true })
    }

    handleClose = (e) => this.setState({
        modalDeckOpen: false, modalCardOpen: false,
        modalSignUpOpen: false, modalLoginOpen: false
    })

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    submitDeck = (e) => {
        e.preventDefault()
        this.handleClose()
        this.props.createDeck(this.state.deckName, this.state.cardId)
    };

    submitCard = (e) => {
        e.preventDefault()
        this.handleClose()
        this.props.createCard(this.state.cardFront, this.state.cardBack, this.state.deckId)
    };

    submitSignUp = (e) => {
        e.preventDefault()
        this.handleClose()
        this.props.signup(this.state.username, this.state.email, this.state.password, this.state.confirmPassword)
    };

    submitLogin = (e) => {
        e.preventDefault()
        this.handleClose()
        this.props.login(this.state.username, this.state.password)
    }

    render() {

        return (
            <>
                <Modal
                    trigger={<Button color='google plus' onClick={this.handleDeckOpen}>Create Deck</Button>}
                    open={this.state.modalDeckOpen}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >

                    <Modal.Content>
                        <Form onSubmit={this.submitDeck}>
                            <Form.Input placeholder='create deck'
                                onChange={this.handleChange} name='deckName' required />
                            <Form.Button type='submit' color='teal'>Create</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
                <Modal
                    trigger={<Button color='yellow' onClick={this.handleCardOpen}>Create Card</Button>}
                    open={this.state.modalCardOpen}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >

                    <Modal.Content>
                        <Form onSubmit={(e) => this.submitCard(e)}>
                            <Form.Input placeholder='card front'
                                onChange={this.handleChange} name='cardFront' required />
                            <Form.TextArea placeholder='card back'
                                onChange={this.handleChange} name='cardBack' required />
                            <Form.Select
                                fluid
                                onChange={this.handleChange}
                                placeholder='select deck'
                                label='deck'
                                name='deckId'
                                size={4}
                                selection
                                options={this.props.selectedDecks ? this.props.selectedDecks.map(deck => ({
                                    name: deck.name,
                                    key: deck.id,
                                    value: deck.id,
                                    text: deck.name
                                })) : []}
                                required />

                            <Form.Button type='submit' color='teal'>Create</Form.Button>
                        </Form>

                    </Modal.Content>
                </Modal>

                <Menu secondary>
                    {localStorage.getItem('token') && this.props.currentUser && this.props.currentUser.id !== 1 ?
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <h4>Welcome, {this.props.currentUser && this.props.currentUser.username}</h4>
                            </Menu.Item>
                            <Menu.Item onClick={this.props.logout}>
                                <h4>Logout</h4>
                            </Menu.Item>
                        </Menu.Menu> :
                        <Menu.Menu position='right'>
                            <Menu.Item onClick={this.handleLoginOpen}>

                                <h4>Login</h4>
                            </Menu.Item>
                            <Menu.Item onClick={this.handleSignUpOpen}>

                                <h4>Sign up</h4>
                            </Menu.Item>
                        </Menu.Menu>
                    }
                </Menu>
                <Modal
                    open={this.state.modalSignUpOpen}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >

                    <Modal.Content>
                        <Form onSubmit={this.submitSignUp} >
                            <Form.Input placeholder='username' label='username' color='white'
                                onChange={this.handleChange} name='username' required />
                            <Form.Input placeholder='email' label='email' color='white'
                                onChange={this.handleChange} name='email' required />
                            <Form.Input type='password' placeholder='password' label='password' color='white'
                                onChange={this.handleChange} name='password' required />
                            <Form.Input type='password' placeholder='confirm password' label='confirm password' color='white'
                                onChange={this.handleChange} name='confirmPassword' required />

                            <Form.Button type='submit' color='pink'>Submit</Form.Button>
                        </Form>

                    </Modal.Content>
                </Modal>

                <Modal
                    open={this.state.modalLoginOpen}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >
                    <Modal.Content>
                        <Form onSubmit={this.submitLogin}>
                            <Form.Input placeholder='username'
                                onChange={this.handleChange} name='username' required />
                            <Form.Input type='password' placeholder='password'
                                onChange={this.handleChange} name='password' required />

                            <Form.Button type='submit' color='orange'>Log In</Form.Button>
                        </Form>

                    </Modal.Content>
                </Modal>
            </>
        )
    };
};

export default Heading; 