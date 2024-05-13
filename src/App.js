
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const emptyGrid = Array(4).fill(null).map(() => Array(4).fill(null));
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(Number(localStorage.getItem('bestScore')) ?? 0);
  const [grid, setGrid] = useState(() => addTwoRandomTwos(emptyGrid));
  const cellColors = {
    null: '#A19486',
    2: '#CDC1B4',
    4: '#CCA67E',
    8: '#534C44',
    16: '#FAB46A',
    32: '#FB972D',
    64: '#A56017',
    128: '#AF7638',
    256: '#FF8400',
    512: '#F7820457',
    1024: '#563919',
    2048: '#FFA443DD',
  }

  function changeScore(addScore,newScore){
    if(addScore){
      newScore += addScore*2
      setScore(score+newScore)
    }
    if(score+newScore>bestScore){
      setBestScore(score+newScore);
      localStorage.setItem('bestScore',score+newScore)
    }
    check2048(addScore*2)
    return newScore;
  }

  function check2048(tile){
    if(tile===2048){
      endGame()
    }
  }

  function Modal({ onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 1000,
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
            <h2>Congratulations!</h2>
            <p>You've reached the <strong>2048 tile!</strong></p>
            <button style={{backgroundColor:'#8F7A66',fontSize:'20px',letterSpacing:'3px',fontWeight:'bold',padding:'5px',border:'1px solid transparent',color:'white',borderRadius:'5px',cursor:'pointer'}} onClick={onClose}>Close</button>
        </div>
    );
}

function endGame() {
  setShowModal(true);
}


  function addTwoRandomTwos(grid) {
    let emptyCells = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });
    for (let i = emptyCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
    }
    if (emptyCells.length >= 2) {
      let [first, second] = emptyCells;
      grid[first.rowIndex][first.colIndex] = 2;
      grid[second.rowIndex][second.colIndex] = 2;
    }
    return grid;
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowUp') moveUp();
      else if (event.key === 'ArrowDown') moveDown();
      if (event.key === 'ArrowLeft') moveLeft();
      else if (event.key === 'ArrowRight') moveRight();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid]);

  function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  function addRandomTwo(newGrid) {
    let emptyCells = [];
    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newGrid[randomCell.rowIndex][randomCell.colIndex] = 2;
    }
    return newGrid;
  }

  function moveUp() {
    if(showModal){
      return;
    }
    let newScore = 0
    let transposedGrid = transpose(grid);
    let newTransposedGrid = transposedGrid.map(row => {
      let filteredRow = row.filter(num => num !== null);
      let mergedRow = [];
      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          mergedRow.push(filteredRow[i] * 2);
          i++;
          newScore = changeScore(filteredRow[i],newScore)
        } 
        else {
          mergedRow.push(filteredRow[i]);
        }
      }
      while (mergedRow.length < 4) {
        mergedRow.push(null);
      }
      return mergedRow;
    });
    if (JSON.stringify(grid) !== JSON.stringify(newTransposedGrid)) {
      newTransposedGrid = addRandomTwo(newTransposedGrid);
      setGrid(transpose(newTransposedGrid));
    }
  }

  function moveDown() {
    if(showModal){
      return;
    }
    let newScore = 0
    let transposedGrid = transpose(grid);
    let newTransposedGrid = transposedGrid.map(row => {
      let filteredRow = row.filter(num => num != null);
      let mergedRow = [];
      for (let i = filteredRow.length - 1; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          mergedRow.push(filteredRow[i] * 2);
          i--;
          newScore = changeScore(filteredRow[i],newScore)
        } 
        else {
          mergedRow.push(filteredRow[i]);
        }
      }
      mergedRow.reverse();
      while (mergedRow.length < 4) {
        mergedRow.unshift(null);
      }
      return mergedRow;
    });
    if (JSON.stringify(grid) !== JSON.stringify(newTransposedGrid)) {
      newTransposedGrid = addRandomTwo(newTransposedGrid);
      setGrid(transpose(newTransposedGrid));
    }
  }

  function moveRight() {
    if(showModal){
      return;
    }
    let newScore = 0
    let newGrid = grid.map(row => {
      let filteredRow = row.filter(num => num != null);
      let mergedRow = [];
      for (let i = filteredRow.length - 1; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          mergedRow.push(filteredRow[i] * 2);
          i--;
          newScore = changeScore(filteredRow[i],newScore)
        } 
        else {
          mergedRow.push(filteredRow[i]);
        }
      }
      mergedRow.reverse();
      while (mergedRow.length < 4) {
        mergedRow.unshift(null);
      }
      return mergedRow;
    });
    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      newGrid = addRandomTwo(newGrid);
      setGrid(newGrid);
    }
  }

  function moveLeft() {
    if(showModal){
      return;
    }
    let newScore = 0
    let newGrid = grid.map(row => {
      let filteredRow = row.filter(num => num !== null);
      let mergedRow = [];
      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          mergedRow.push(filteredRow[i] * 2);
          i++;
          newScore = changeScore(filteredRow[i],newScore)
        } 
        else {
          mergedRow.push(filteredRow[i]);
        }
      }
      while (mergedRow.length < 4) {
        mergedRow.push(null);
      }
      return mergedRow;
    });
    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      newGrid = addRandomTwo(newGrid);
      setGrid(newGrid);
    }
  }

  function startNewGame(){
    const emptyGrid = Array(4).fill(null).map(() => Array(4).fill(null));
    setGrid(addTwoRandomTwos(emptyGrid));
  }
  

  function getCellStyle(cell) {
    let cellStyle = {
      width: '100%',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '5px',
      fontSize: '30px',
      fontWeight: 'bolder',
      color: 'white',
      transition:'300ms',
    };
    cellStyle['backgroundColor'] = cellColors[cell];
    return cellStyle
  }
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', background: 'linear-gradient(90deg, #ADD6F6 0%, #F5F1CE 42.71%, #9BC5D6 100%)' }}>
      {showModal && <Modal onClose={() => {setShowModal(false);startNewGame()}} />}
      <div class="main">
        <div class="header">
          <span class="name">2048</span>
          <div class="score" >
            <div class="score-bg">
              <span class="text">Score</span>
              <span class="number">{score}</span>
            </div>
            <div class="score-bg">
              <span class="text">Best</span>
              <span class="number">{bestScore}</span>
            </div>
          </div>
        </div>
        <div class="" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
          <span class="desc" style={{ flex: 1, maxWidth: '50%', color: '#988776' }}>Join the numbers and get to the <strong>2028 tile!</strong></span>
          <div onClick={startNewGame} class="newGame" style={{ cursor: 'pointer' }}>New Game</div>
        </div>
        <div style={{ width: '100%', backgroundColor: '#BBADA0', marginTop: '4vh', padding: '10px', borderRadius: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} style={getCellStyle(cell)}>
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>
        <div class="instructions" style={{ width: '100%', color: '#988776', marginTop: '5vh', marginBottom: '5vh' }}>
          <strong>How to play</strong>: Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
        </div>
      </div>

    </div>
  );
}

export default App;
