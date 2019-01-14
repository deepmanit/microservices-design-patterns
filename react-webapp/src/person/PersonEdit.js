import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {AvFeedback, AvForm, AvInput, AvGroup} from 'availity-reactstrap-validation';
import {Button, Container, Label} from 'reactstrap';
import AppNavbar from '../home/AppNavbar';
import MessageAlert from '../MessageAlert';
import { errorMessage } from '../common/Util';

class PersonEdit extends Component {
  emptyPerson = {
    name: '',
    age: '',
    children: [{
      name: '',
      age: ''
    }],
    address: {
      address: '',
      city: '',
      stateOrProvince: '',
      country: '',
      postalCode: ''
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      person: this.emptyPerson,
      displayError: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      try {
        const person = await (await fetch(`/api/persons/${this.props.match.params.id}`)).json();
        person.authorities.forEach((authority, index) => {person.authorities[index] = authority.role});
        this.setState({user: person});
      } catch (error) {
        this.setState({ displayError: errorMessage(error)});
      }
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let person = {...this.state.user};
    person[name] = value;
    this.setState({user: person});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {person} = this.state;

    await fetch('/api/users', {
      method: (person.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(person),
      credentials: 'include'
    }).then(response => response.json())
        .then(data => {
          if (data.id) {
            this.props.history.push('/users');
          } else {
            this.setState({ displayError: errorMessage(data)});
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }

  render() {
    const {person, displayError} = this.state;
    const title = <h2>{person.id ? 'Edit Person' : 'Add Person'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <AvForm onValidSubmit={this.handleSubmit}>
          <AvGroup>
            <Label for="name">Full Name</Label>
            <AvInput type="text" name="name" id="name" value={person.name || ''}
                   onChange={this.handleChange} placeholder="Full Name"
                     required
                     minLength="5"
                     maxLength="100"
                     pattern="^[A-Za-z0-9\s+]+$" />
            <AvFeedback>
              This field is invalid - Your Full Name must be between 5 and 100 characters.
            </AvFeedback>
          </AvGroup>
          <AvGroup>
            <Label for="age">Age</Label>
            <AvInput type="number" name="age" id="age" value={person.age || ''}
                   onChange={this.handleChange} placeholder="Age"
                     required
                     minLength="1"
                     maxLength="3" />
            <AvFeedback>
              This field is invalid - Required
            </AvFeedback>
          </AvGroup>
          <AvGroup>
            <Label for="address">Address</Label>
            <AvInput type="text" name="address" id="address" value={person.address.address || ''}
                   onChange={this.handleChange} placeholder="Address"/>
          </AvGroup>
          <div className="row">
            <AvGroup className="col-md-4 mb-3">
              <Label for="city">City</Label>
              <AvInput type="text" name="city" id="city" value={person.address.city || ''}
                     onChange={this.handleChange} placeholder="City"/>
            </AvGroup>
            <AvGroup className="col-md-4 mb-3">
              <Label for="stateOrProvince">State/Province</Label>
              <AvInput type="text" name="stateOrProvince" id="stateOrProvince" value={person.address.stateOrProvince || ''}
                     onChange={this.handleChange} placeholder="State/Province"/>
            </AvGroup>
            <AvGroup className="col-md-4 mb-3">
              <Label for="country">Country</Label>
              <AvInput type="text" name="country" id="country" value={person.address.country || ''}
                     onChange={this.handleChange} placeholder="Country"/>
            </AvGroup>
            <AvGroup className="col-md-4 mb-3">
              <Label for="country">Postal Code</Label>
              <AvInput type="text" name="postalCode" id="postalCode" value={person.address.postalCode || ''}
                     onChange={this.handleChange} placeholder="Postal Code"/>
            </AvGroup>
          </div>
          <AvGroup>
            <Button color="primary" type="submit">{person.id ? 'Save' : 'Create'}</Button>{' '}
            <Button color="secondary" tag={Link} to="/persons">Cancel</Button>
          </AvGroup>
          <MessageAlert {...displayError}></MessageAlert>
        </AvForm>
      </Container>
    </div>
  }
}

export default withRouter(PersonEdit);