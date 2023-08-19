import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { fetchTrains } from './services/trains';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
  },
});

class Trains extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trains: []
    };
  }

  componentDidMount() {
    this.fetchTrains();
  }

  fetchTrains() {
    fetchTrains()
      .then(response => response.json())
      .then(data => this.setState({ trains: data }));
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <h1>Trains</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Train Number</th>
                <th>Train Name</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.state.trains.map(train => (
                <tr key={train.trainNumber}>
                  <td>{train.trainNumber}</td>
                  <td>{train.trainName}</td>
                  <td>{train.departureTime}</td>
                  <td>{train.arrivalTime}</td>
                  <td>{train.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ThemeProvider>
    );
  }
}

export default Trains;