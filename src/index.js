import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" 
            onClick = {props.onClick}
    >
      {props.value}
    </button>
  );
}

// comment 


// a few global variables to be used
// concern 1.i need to count the amount of X's and O's
var x = 0; 
var y = 0;

// count number of turns
var turns = 0; 

// keep track of deleted space
var deletedSquare = -1; // cannot be [0,8]

// current square for after 6 moves!
var currentSquare = -1;

// check if we are allowed to delete 
var checkDelete = true; 

// check if we are deleting the right variable
var checkVarDelete; // setting default to neither of our options

// check what is in the center
var xCenter = false;
var oCenter = false; 

// check if next move wins or not
var xneedWin = false;
var oneedWin = false; 

// check if x or o won
var xCheckWin = false; 
var oCheckWin = false;



class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };

   
  }

  handleClick(i) {

    const squares = this.state.squares.slice();

    

    // Change to if statement to multiple if else statements fix concern 1.ii
    // first check for winner 
    if(calculateWinner(squares)){  
      return; 
    }


    // action if sqaure is empty for first six turns 
    else if (squares[i] === null && turns < 6){
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });

      // counting the number of X's and turns
      if(squares[i] == 'X'){
        x++;
        turns++;

        // check if center is x
        if (i === 4){
          xCenter = true; 
        }

      }

      // counting the number of O's and turns 
      if(squares[i] == 'O'){
        y++;
        turns++;

        // check if center is o
        if (i === 4){
          oCenter = true; 
        }
      }

      if(turns == 5){
          checkVarDelete = this.state.xIsNext
        }


    }


    // action if square is not empty
    // add a stipulation to make sure the amount of turns is at least 6 bc we need 3 
    
    else if(turns >= 6 && checkDelete == true) {
      
      // need to make sure we only delete the correct piece
      if ((this.state.xIsNext && (squares[i] === "X")) || (!this.state.xIsNext && (squares[i] === "O") && checkDelete === true) ) {
      
        // checkVarDelete = this.state.xIsNext; // setting the variable we need to delete
        // checkVarDelete = squares[i];
        if (this.state.xIsNext && squares[i] === "X"){
          checkVarDelete = 'X';
        }
        else if(!this.state.xIsNext && squares[i] === "O"){
         checkVarDelete ='O'; 

        }
        

        // case 3: xCenter = false and oCenter = false
        if (xCenter === false && oCenter === false ){

          // check to delete an X and delete if X normally  
          if (squares[i] === 'X' && checkVarDelete === 'X'){
            // decrement the amount of X
            x--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
             //  xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });

          } // done deleting X

          // check to delete O 
          else if( squares[i] === "O" && checkVarDelete === 'O' ){
            // decrement the amount of O
            y--;
            deletedSquare = i; // location of deleted sqquare 

            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
              // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });
          }   // done deleting O 

        }

        // case 1: x is in the center and it is x's turn

        else if (xCenter === true && oCenter === false && checkVarDelete === 'X'){
          if ( i === 4 && squares[i] === 'X' && checkVarDelete === 'X' ){
            // decrement the amount of X
            x--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
            // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });
            xCenter = false;

          } // done deleting X

          else{
            xneedWin = true;
            alert('You need to win in your next move')

            x--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
            // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });

          }

        }


        // case 4: O is in the center and it is O's turn 
        else if (oCenter === true && xCenter === false && checkVarDelete === 'O'){
          if ( i === 4 && squares[i] === 'O' && checkVarDelete === 'O' ){
            // decrement the amount of o
            y--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
              // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });
            oCenter = false;

          } // done deleting O

          else{
            oneedWin = true; 
            alert('You need to win in your next move')

            // decrement the amount of o
            y--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
              // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });

          }

        }


        // what to do if O is center but not O's turn (aka X's turn) - case 5a
        else if(oCenter === true && xCenter === false && checkVarDelete === 'X'){
          // need to delete and replace x per normal
          if (squares[i] === 'X' && checkVarDelete === 'X'){
            // decrement the amount of X
            x--;
            deletedSquare = i; // location of deleted sqquare 


            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
             //  xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });

          } // done deleting X

        }

        // need to do similarly with X 
        // what to do if X is center but it is not X's turn (aka O's turn) - case 5b
        else if (xCenter === true && oCenter === false && checkVarDelete === 'O'){
          // need to delete O as per normal 
          // decrement the amount of O
            y--;
            deletedSquare = i; // location of deleted sqquare 

            squares[i] = null; // removing mark 
            checkDelete = false; // can no longer delete anything 
            this.setState({
              squares: squares,
              // xIsNext: this.state.xIsNext, // maintain current X vs O state 
            });
        }


        

          /*
        // warning for incorrect X or O
        else if ( (squares[i] === "O" && checkVarDelete !== 'O') || (squares[i] === 'X' && checkVarDelete !== 'X') ) {
          alert("Please pick your correct piece");
        }
        */

      } 
    }

    // need to check
    // action to be taken if just removed a square 
    else if (turns >= 6 && deletedSquare >= 0 && deletedSquare <= 8 && checkDelete === false) {
      // pass through nextLocation to get array of spaces we can go 
      var possibleSpaces = nextLocation(deletedSquare);

      // possible conditions
      // a) empty space, in list

      if((xneedWin === false && oneedWin === false) || (xneedWin === true && checkVarDelete === 'O') || (oneedWin === true && checkVarDelete === 'X') ){
        if (possibleSpaces.includes(i) && squares[i] === null ){
          squares[i] = this.state.xIsNext ? 'X' : 'O';
          this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
          });

          // counting the number of X's and turns
          if(squares[i] === 'X'){
            x++;
            turns++;

            // check if center is x
            if (i === 4){
              xCenter = true; 
              alert('Note to Player X: X is in the center, your next move must either vacate X in center or be a win')
            }

          }


          // counting the number of O's and turns 
          if(squares[i] === 'O'){
            y++;
            turns++;

            // check if center is o
            if (i === 4){
              oCenter = true; 
              alert('Note to Player O: O is in the center, your next move must either vacate O in center or be a win')
            }
          }

          checkDelete = true; 
        
        }


        // b) empty space, not in list 
        else if (!possibleSpaces.includes(i) && squares[i] == null){
          alert("Please choose an adjacent square that is empty!");
        }
        // c) not empty space, in list
        else if (possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
          alert("Please choose an adjacent square that is empty!");
        }
        // d) not empty space, in list
        else if (!possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
          alert("Please choose an adjacent square that is empty!");
        }

      } // end of xneedWin === false && oneedWin === false

      // case B where X needs it win and it is X's turn 
      else if ( xneedWin === true && checkVarDelete === 'X'){

        // a) empty space in the list 
        if(possibleSpaces.includes(i) && squares[i] === null){

          squares[i] = this.state.xIsNext ? 'X' : 'O';
          this.setState({
            squares: squares,
            // xIsNext: !this.state.xIsNext,
          });

          xCheckWin = true; 

        }
          // b) empty space, not in list 
          else if (!possibleSpaces.includes(i) && squares[i] == null){
            alert("Please choose an adjacent square that is empty!");
          }
          // c) not empty space, in list
          else if (possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
            alert("Please choose an adjacent square that is empty!");
          }
          // d) not empty space, in list
          else if (!possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
            alert("Please choose an adjacent square that is empty!");
        
          }

      }  

      // case C where O needs to win and it is O's turn
      else if ( oneedWin === true && checkVarDelete === 'O'){

        // a) empty space in the list 
        if(possibleSpaces.includes(i) && squares[i] === null){
          squares[i] = this.state.xIsNext ? 'X' : 'O';
          this.setState({
            squares: squares,
            // xIsNext: !this.state.xIsNext,
          });
          oCheckWin = true; 
        }


        // b) empty space, not in list 
        else if (!possibleSpaces.includes(i) && squares[i] == null){
          alert("Please choose an adjacent square that is empty!");
        }
        // c) not empty space, in list
        else if (possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
          alert("Please choose an adjacent square that is empty!");
        }
        // d) not empty space, in list
        else if (!possibleSpaces.includes(i) && (squares[i] == 'X' || squares[i] == 'O') ){
          alert("Please choose an adjacent square that is empty!");
        
        }

      }



    }
    // some alerts to let the players know but this is only for after the first 6 rounds 
    if(turns == 5 && xCenter === true) {
      alert('Dear Player X: Note that you are placing your 3rd piece and you have an X is in the center, your next turn must either vacate X in center or be a win')
    }
    if (turns === 6 && oCenter === true){
      alert('Dear Player O: Note that you are placing your 3rd piece and you have an O is in the center, your next turn must either vacate O in center or be a win')
    }


  }



  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }


  render() {
    const winner = calculateWinner(this.state.squares);
    let status;

    if(xneedWin === true && xCheckWin === true && !winner){
      alert('Player X has lost please reset the game')
    }

    if(oneedWin === true && oCheckWin === true && !winner){
      alert('Player O has lost please reset the game')
    }

   
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// comment 

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function nextLocation(squareNumber)
{
  // square number passed is i from squares[i]
  // return an array of numbers wehre the next sqaure could go
  if (squareNumber == 0){
    return[1, 3, 4]
  }
  else if (squareNumber == 1){
    return[0, 2, 3, 4, 5]
  }
  else if (squareNumber == 2){
    return[1, 4, 5]
  }
  else if (squareNumber == 3){
    return[0, 1, 4, 7, 6]
  }
  else if (squareNumber == 4){
    return[0, 1, 2, 3, 5, 6, 7, 8]
  }
  else if (squareNumber == 5){
    return[1, 2, 4, 7, 8]
  }
  else if (squareNumber == 6){
    return[3, 4, 7]
  }
  else if (squareNumber == 7){
    return[3, 4, 5, 6, 8]
  }
  else if (squareNumber == 8){
    return[4, 5, 7]
  }


}

function checkWinner(squares){
  // checking the winners using calculate winner and either returns 
  var aaa = calculateWinner(squares)
  return aaa

}










