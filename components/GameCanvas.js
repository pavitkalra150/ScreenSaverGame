import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Orientation from 'react-native-orientation';

class GameCanvas extends Component {
  constructor() {
    super();
    this.state = {
      isPaused: false, // Flag to track whether the square is paused
      squareX: this.getRandomPosition(0, Dimensions.get('window').width - 50), // Random X position
      squareY: this.getRandomPosition(0, Dimensions.get('window').height - 50), // Random Y position
      squareSize: 50,
      squareColor: 'blue',
      xDirection: 1,
      yDirection: 1,
      canvasWidth: Dimensions.get('window').width,
      canvasHeight: Dimensions.get('window').height,
      speed: 2, // Initial speed of the square
    };

    // Initialize PanResponder for gesture handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        const { speed } = this.state;

        if (gestureState.numberActiveTouches === 1) {
          // Handle single tap to pause/resume
          this.handleSingleTap();
        }
      },
    });
  }

  componentDidMount() {
    this.startGameLoop();
    Orientation.addOrientationListener(this.updateCanvasSize);
    this.updateCanvasSize();
  }

  componentWillUnmount() {
    clearInterval(this.gameLoopInterval);
    Orientation.removeOrientationListener(this.updateCanvasSize);
  }

  updateCanvasSize = () => {
    const { width, height } = Dimensions.get('window');
    this.setState({
      canvasWidth: width,
      canvasHeight: height,
    });
  };

  // Toggle the pause state on a single tap
  handleSingleTap = () => {
    this.setState((prevState) => ({ isPaused: !prevState.isPaused }));
  };

  // Decrease speed on long-press, but limit it within a range
  handleLongPress = (currentSpeed) => {
    const minSpeed = 1; // Minimum speed
    if (currentSpeed > minSpeed) {
      this.setState({ speed: currentSpeed - 1 });
    }
  };

  drawCanvas() {
    // ... (existing code)
  }

  startGameLoop() {
    this.gameLoopInterval = setInterval(() => {
      if (!this.state.isPaused) {
        this.moveSquare();
      }
    }, 16); // Approximately 60 FPS
  }

  moveSquare() {
    const { squareX, squareY, squareSize, xDirection, yDirection, speed } = this.state;

    // Calculate the new position of the square with adjusted speed
    let newSquareX = squareX + 2 * xDirection * speed;
    let newSquareY = squareY + 2 * yDirection * speed;

    // Check if the square hits the canvas boundaries
    const { canvasWidth, canvasHeight } = this.getCanvasSize();
    if (newSquareX < 0 || newSquareX + squareSize > canvasWidth) {
      // Reflect the square horizontally when it hits a horizontal wall
      this.setState({
        xDirection: -xDirection,
        squareColor: getRandomColor(),
      });
    }

    if (newSquareY < 0 || newSquareY + squareSize > canvasHeight) {
      // Reflect the square vertically when it hits a vertical wall
      this.setState({
        yDirection: -yDirection,
        squareColor: getRandomColor(),
      });
    }

    // Update the square's position
    this.setState({
      squareX: newSquareX,
      squareY: newSquareY,
    });
  }

  getCanvasSize() {
    return {
      canvasWidth: this.state.canvasWidth,
      canvasHeight: this.state.canvasHeight,
    };
  }

  getRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render() {
    return (
      <View
        style={[
          styles.canvas,
          {
            backgroundColor: 'transparent',
            width: this.state.canvasWidth,
            height: this.state.canvasHeight,
          },
        ]}
        {...this.panResponder.panHandlers} // Enable gesture detection
      >
        <View
          style={[
            styles.square,
            {
              left: this.state.squareX,
              top: this.state.squareY,
              width: this.state.squareSize,
              height: this.state.squareSize,
              backgroundColor: this.state.squareColor,
            },
          ]}
        />
        {/* Add a touchable area to toggle pause on single tap */}
        <TouchableOpacity
          style={styles.touchArea}
          activeOpacity={1}
          onPress={this.handleSingleTap}
          onLongPress={() => this.handleLongPress(this.state.speed)} // Long-press to decrease speed
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    position: 'absolute',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default GameCanvas;
