import React, { Component } from 'react';
import NavBar from './Navbar';
import {
    Card,
    Button,
    CardTitle,
    CardText,
    Container,
    CardColumns
} from 'reactstrap';

class App extends Component {
    state = {
      todos: []
    };
  
    async componentDidMount() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api-v1/');
        const todos = await res.json();
        this.setState({
          todos
        });
      } catch (e) {
        console.log(e);
      }
    }

    handleChangeChk() {
        console.log('Changed')
    }
  
    render() {
      return (
        <div>
            <NavBar />
            <Container>
                <CardColumns>
                    {this.state.todos.map(item => (
                        <Card body key={item.id}>
                            <div>
                                <input className="float-right" type="checkbox" autoComplete="off" defaultChecked={item.status} onChange={this.handleChangeChk} />
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardText>{item.description}.</CardText>
                            <Button color="primary">Mark as done</Button>
                        </Card>
                    ))}
                </CardColumns>
            </Container>
        </div>
      );
    }
  }

export default App;