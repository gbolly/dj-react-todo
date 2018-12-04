import React, { Component } from 'react';
import NavBar from './Navbar';
import {
    Card,
    Button,
    CardTitle,
    CardText,
    Container,
    CardColumns,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,  
} from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';


const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api-v1/'
})

class App extends Component {
    state = {
        todos: [],
        modal: false,
        title: "",
        description: "",
        status: false
    };
  
    async componentDidMount() {
        try {
            const res = await axiosInstance.get("/");
            const todos = await res.data;
            this.setState({
                todos
            });
        } catch (e) {
            console.log(e);
        }
    }

    addTodo = () => {
        const { title, description, status} = this.state;
        try {
            const reqBody = {title, description, status}
            axiosInstance.post(`/`, reqBody)
            this.setState({
                todos: [...this.state.todos, reqBody],
                modal: !this.state.modal
            })
        } catch (e) {
            console.error(e)
        }
    }

    updateTodo = (id, checkStatus) => {
        try {
            const reqBody = this.state.todos.find(function (todo) {
                if (todo.id.toString() === id.toString()) {
                    todo.status = checkStatus;
                    return todo;
                }
            });
            axiosInstance.put(`/${id}/`, reqBody)
        } catch (e) {
            console.error(e)
        }
    }

    deleteTodo = (id) => {
        try {
            axiosInstance.delete(`/${id}/`);
            this.setState({todos: this.state.todos.filter(el => el.id !== id)});
        } catch (e) {
            console.error(e)
        }
    }

    handleChangeChk = (e) => {
        const todoId = e.target.dataset.id;
        let isChecked = e.target.checked;
        this.updateTodo(todoId, isChecked);
        this.setState(this.state)
    }

    handleButtonClick = (item) => {
        const inputChecked = document.getElementById(`checkbox-${item.id}`);
        if (!item.status) {
            inputChecked.checked = true;
        } else {
            inputChecked.checked = false;
        }
        this.updateTodo(item.id, inputChecked.checked);
        this.setState(this.state)
    }

    handleDelete = (item) => {
        this.deleteTodo(item.id);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    }

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value});
    }

    handleSubmit = () => {
        this.addTodo();
    }

    button = (item) => {
        if (item.status === true) {
            return (
                <Button
                    outline
                    color="danger"
                    onClick={() => { if (window.confirm('Are you sure you wish to delete this item?'))
                    this.handleDelete(item)} }
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>);
        } else {
            return (<Button color="primary" data-id={item.id} onClick={() => this.handleButtonClick(item)}>Mark as done</Button>)
        }
    }
  
    render() {
      return (
        <div>
            <NavBar />
            <Container className="mt-5">
                <Button className="mb-3" outline color="primary" onClick={this.toggle}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                    Add Todo
                </Button>
                <CardColumns>
                    {this.state.todos.map(item => (
                        <Card body key={item.id}>
                            <div>
                                <input
                                    className="float-right rounded"
                                    id={`checkbox-${item.id}`}
                                    type="checkbox"
                                    autoComplete="off"
                                    data-id={item.id}
                                    defaultChecked={item.status}
                                    onChange={this.handleChangeChk}
                                />
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardText>{item.description}.</CardText>
                            {this.button(item)}
                        </Card>
                    ))}
                </CardColumns>
            </Container>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="todoHeader">Title</Label>
                        <Input
                            type="text"
                            name="text"
                            id="todoHeader"
                            placeholder="Add a title"
                            onChange={this.handleTitleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="todoDescription">Description</Label>
                        <Input
                            type="textarea"
                            name="text"
                            id="todoDescription"
                            placeholder="Describe task"
                            onChange={this.handleDescriptionChange}
                            required/>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.handleSubmit}>Add</Button>
            </ModalFooter>
            </Modal>
        </div>
      );
    }
  }

export default App;