import './App.css';
import React, { Component, useState, createRef, useEffect } from 'react';
import { Button, Modal} from 'react-bootstrap';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      turn: "red",
      gameOver: false,
      winner: "",
    };

    this.tiles = [];
    this.tileRefs = new Array(6).fill(0).map(() => new Array(7));
    this.buttons = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        this.tileRefs[i][j] = createRef();
        const tile = <Tile ref={this.tileRefs[i][j]} />;
        this.tiles.push(tile);
      }
    }
    for (let i = 0; i < 7; i++) {
      this.buttons.push(<Button 
                          variant="success"
                          className="button"
                          onClick={() => this.play(i)}
                        />);
    }
  }

  componentDidMount() {
    
  }
  

  play(col) {
    // console.log(col);
    if (this.putTile(col) === false) {
      return;
    }
    this.setState(prevState => {
      return {
        turn: prevState.turn == "red" ? "yellow" : "red"
      }
    }, this.isGameOver);
    // this.isGameOver();
  }

  putTile(col) {
    // if the column is full, dont put anything
    if (this.tileRefs[0][col].current.getColor() !== "white" || this.state.gameOver == true) {
      return false;
    }
    
    for (let i = 0; i < 6; i++) {
      if (i == 5 || this.tileRefs[i + 1][col].current.getColor() != "white") {
        this.tileRefs[i][col].current.setColor(this.state.turn);
        break;
      }
    }
    return true;
  }

  isGameOver() {
    // horizontal
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        let reds = 0;
        let yellows = 0;
        for (let k = 0; k < 4; k++) {
          if (this.tileRefs[i][j + k].current.getColor() == "red") {
            reds++;
          } else if (this.tileRefs[i][j + k].current.getColor() == "yellow") {
            yellows++;
          }
        }
        if (reds == 4 || yellows == 4) {
          this.setState({gameOver: true, winner: reds == 4 ? "red" : "yellow"});
          return true;
        }
      }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        let reds = 0;
        let yellows = 0;
        for (let k = 0; k < 4; k++) {
          if (this.tileRefs[i + k][j].current.getColor() == "red") {
            reds++;
          } else if (this.tileRefs[i + k][j].current.getColor() == "yellow") {
            yellows++;
          }
        }
        if (reds == 4 || yellows == 4) {
          this.setState({gameOver: true, winner: reds == 4 ? "red" : "yellow"});
          return true;
        }
      }
    }

    // cross-1
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        let reds = 0;
        let yellows = 0;
        for (let k = 0; k < 4; k++) {
          if (this.tileRefs[i + k][j + k].current.getColor() == "red") {
            reds++;
          } else if (this.tileRefs[i + k][j + k].current.getColor() == "yellow") {
            yellows++;
          }
        }
        if (reds == 4 || yellows == 4) {
          this.setState({gameOver: true, winner: reds == 4 ? "red" : "yellow"});
          return true;
        }
      }
    }

    // cross-2
    for (let i = 5; i >= 3; i--) {
      for (let j = 0; j < 4; j++) {
        let reds = 0;
        let yellows = 0;
        for (let k = 0; k < 4; k++) {
          if (this.tileRefs[i - k][j + k].current.getColor() == "red") {
            reds++;
          } else if (this.tileRefs[i - k][j + k].current.getColor() == "yellow") {
            yellows++;
          }
        }
        if (reds == 4 || yellows == 4) {
          this.setState({gameOver: true, winner: reds == 4 ? "red" : "yellow"});
          return true;
        }
      }
    }

    return false;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Turn: {this.state.turn}
          <div className="cell-container">
            {this.buttons}
            {this.tiles}
          </div>

          <GameOverModal 
            show={this.state.gameOver} 
            onClose={() => this.setState({gameOver: false})}
            winner={this.state.winner}
          />

        </header> 
      </div>
    );
  }
}

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "white"
    };
  }

  setColor(color) {
    this.setState({color: color});
  }

  getColor() {
    return this.state.color;
  }

  render() {
    return (
      <div className="cell" style={{backgroundColor: this.state.color}}>{this.props.text}</div>
    );
  }
}

function GameOverModal(props) {
  return <Modal
          show={props.show}
          onHide={props.onClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Game Over</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Player {props.winner} won.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
}

export default App;
