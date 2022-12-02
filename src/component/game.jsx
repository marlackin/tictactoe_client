import React from 'react';
import io from 'socket.io-client';
import Util from '../utils/index';
import Board from './board';
import {withRouter} from 'react-router-dom'
import '../index.css';
const queryString = require('query-string');

var socket = null;
 class Game extends React.Component {
    
    constructor(props) {
        console.log(props)
        super(props);
        this.state = {
            id: null,
            player1: null,
            player2: null,
            board: {
              history: [{
                squares: Array(9).fill(null)
              }],
              stepNumber: 0,
              next: null,
            },
            status: 'waiting'
        }   
        
    }

    componentWillMount() {
        this.util = new Util();
        socket = io("http://localhost:5000/", {
            transports: ["websocket"] // use webSocket only
          });
        console.log(this.props)

        //get query string
        const parsed = queryString.parse(this.props.location.search);
        console.log(parsed)
        if (parsed.type === 'create') {
            this.createRoom((parsed.name === '') ? 'player 1' : parsed.name);
        } else if (parsed.type === 'join') {
            this.joinRoom((parsed.name === '') ? 'player 2' : parsed.name, parsed.room);
        }
    }
    componentDidMount() {
        this.socketListenHandle();
    }

    socketListenHandle() {
        socket.on('onStart', data => this.setState(data));
        socket.on('onChange', data => this.setState(data));
        socket.on('onJoin', data => {
            if (data.code !== 404) {
              this.setState(data);
            } else {
                alert('room not found');
                window.history.back();
            }
        });
        socket.on('onCreate', data => {
            this.me = data.player1;
            this.myTick = 'X';
            this.setState(data);
        });
    }

    createRoom(name) {
        socket.emit('create_room', name);
    }

    joinRoom(name, room) {
        this.me = name;
        this.myTick = 'O';
        socket.emit('join_room', [name, room]);
    }

    handleClick(i) {
        if (this.state.status === 'finished') return;
        const history = this.state.board.history.slice(0, this.state.board.stepNumber + 1);
        const current = history[this.state.board.stepNumber];
        const squares = current.squares.slice();
        if (this.util.calculateWinner(squares) || squares[i])
            return;
        if (this.state.board.next !== this.me)
            return;

        squares[i] = this.myTick;
        let newState = this.state;
        newState.board.history = history.concat([{
          squares: squares,
        }]);
        newState.board.stepNumber = history.length;
        newState.board.next = (this.me === this.state.player1) ? this.state.player2 : this.state.player1;
        this.setState(newState);        
        socket.emit('state_change', this.state);
    }

    jumpTo(step) {
        var newState = this.state;
        newState.board.stepNumber = step;
        newState.board.next = (step % 2 === 0) ? this.state.player1 : this.state.player2; 
        this.setState({
            newState
        })        
    }

    render() {
        const history = this.state.board.history;
        const current = history[this.state.board.stepNumber];
        const check = this.util.calculateWinner(current.squares);
        const winner = check === 'O' ? this.state.player2 : this.state.player1;

        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move : 
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })
        let status;
        if (check != null) {
            if (check === 'draw') {
                status = 'DRAW!!!';
            } else {
                status = 'Winner: ' + winner;
            }
            this.state.status = 'finished';
        } else {
            status = 'Next player: ' + this.state.board.next;
        }
        return (
        <div id="container">
            <div id="box" className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div className="game-status">Room: #<font color="red">{this.state.id}</font></div>
                    <div className="game-status">{status}</div>
                    <ol>{moves}</ol>
                </div>
                <br/>
            </div>
        </div>
      );
    }
  }

  export default withRouter(Game)