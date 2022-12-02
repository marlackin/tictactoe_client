import React from 'react';
import { useNavigate } from 'react-router-dom'

export default class Home extends React.Component {
    constructor(props) {
        console.log(props)
        super(props);
        this.state = {
            create: {
                name: "",
            },
            join: {
                name: "",
                room: "",
            }
        }
    }
    createNameChange(e) {
        this.setState({
            create: {
                name: e.target.value
            }
        });
    }
    joinNameChange(e) {
        var newState = this.state;
        newState.join.name = e.target.value;
        this.setState(newState);
        
    }
    joinRoomChange(e) {
        var newState = this.state;
        newState.join.room = e.target.value;
        this.setState(newState);
    }

    join() {
        window.location = "/game?type=join&room="+this.state.join.room+"&name="+this.state.join.name;
    }

    create() {
        window.location = "/game?type=create&name="+this.state.create.name;
        // this.props.history.push('/game?type=create&name='+this.state.create.name)
    }
        render() {
          return (
            <div id="container">
                <div id="box">
                <div id="create-box" className="col50">
                    <h2>Create Room</h2>
                    <div className="form-group">
                        <label>Name: </label>
                        <input onChange={(e)=>this.createNameChange(e)} type="text" placeholder="name"/>
                    </div>
                    <button className="btn" onClick={() => this.create()}>Create</button>
                </div>
                <div id="join-box" className="col50">
                <h2>Join Room</h2>
                <div className="form-group" >
                    <label>Name: </label>
                    <input type="text" onChange={(e)=>this.joinNameChange(e)}  placeholder="name"/>
                </div>
                <div className="form-group">
                    <label>Room number: </label>
                    <input type="text" onChange={(e)=>this.joinRoomChange(e)} placeholder="1234"/>
                </div>
                <button onClick={()=>this.join()} className="btn">Join</button>
                </div>
                </div>
            </div>
          );
        }
      }