import React, {Component} from 'react';
import { Header, Icon } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'
import './App.css';
import { valueToNode } from '@babel/types';
import axios from 'axios';

class App extends Component{
  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then((response) => {
        this.setState({
          values : response.data
        })  
      })
  }
  render() {
    return (
      <div>
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>CoreReact</Header.Content>
        </Header>
        <List>
          <List.Item>Apples</List.Item>
          <List.Item>Pears</List.Item>
          <List.Item>Oranges</List.Item>
        </List>
        <ul>
          {this.state.values.map((value: any) => (
            <li key={value.id}>{value.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
