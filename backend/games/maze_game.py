import random
from typing import List
from pydantic import BaseModel


class Position(BaseModel):
    x: int
    y: int

class GameState(BaseModel):
    player_position: Position
    goal_position: Position
    maze_layout: List[List[int]]
    game_over: bool

class GameConfig(BaseModel):
    width: int = 10
    height: int = 10

class MoveRequest(BaseModel):
    direction: str

class MazeGame:
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
        self.grid = self._generate_maze()
        self.start_pos = Position(x=0, y=0)
        self.goal_pos = Position(x=width-1, y=height-1)
        self.player_pos = Position(x=0, y=0)
        self.game_over = False
    
    def _generate_maze(self) -> List[List[int]]:
        # Initialize maze with all walls (1)
        maze = [[1 for _ in range(self.width)] for _ in range(self.height)]
        
        def carve_path(x: int, y: int):
            maze[y][x] = 0  # Mark current cell as path
            
            # Define possible directions (up, right, down, left)
            directions = [(0, -2), (2, 0), (0, 2), (-2, 0)]
            random.shuffle(directions)  # Randomize directions
            
            # Try each direction
            for dx, dy in directions:
                new_x, new_y = x + dx, y + dy
                
                # Check if the new position is within bounds
                if (0 <= new_x < self.width and 
                    0 <= new_y < self.height and 
                    maze[new_y][new_x] == 1):  # If it's still a wall
                    
                    # Carve the path by making the wall between current and new position a path
                    maze[y + dy//2][x + dx//2] = 0
                    maze[new_y][new_x] = 0
                    carve_path(new_x, new_y)
        
        # Start from the beginning (0,0)
        carve_path(0, 0)
        
        # Ensure the goal is accessible
        maze[self.height-1][self.width-1] = 0
        
        # Make sure there's a path to the goal
        if self.width > 2 and self.height > 2:
            maze[self.height-1][self.width-2] = 0  # Path to goal horizontally
            maze[self.height-2][self.width-1] = 0  # Path to goal vertically
            
        return maze
    
    def is_valid_move(self, pos: Position) -> bool:
        if (0 <= pos.x < self.width and 
            0 <= pos.y < self.height and 
            self.grid[pos.y][pos.x] == 0):
            return True
        return False
    
    def get_nearby_walls(self) -> List[Position]:
        walls = []
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_x = self.player_pos.x + dx
            new_y = self.player_pos.y + dy
            if (0 <= new_x < self.width and 
                0 <= new_y < self.height and 
                self.grid[new_y][new_x] == 1):
                walls.append(Position(x=new_x, y=new_y))
        return walls
    
    def move_player(self, direction: str) -> bool:
        new_pos = Position(x=self.player_pos.x, y=self.player_pos.y)
        
        if direction == "up":
            new_pos.y -= 1
        elif direction == "down":
            new_pos.y += 1
        elif direction == "left":
            new_pos.x -= 1
        elif direction == "right":
            new_pos.x += 1
            
        if self.is_valid_move(new_pos):
            self.player_pos = new_pos
            self.game_over = (new_pos.x == self.goal_pos.x and 
                            new_pos.y == self.goal_pos.y)
            return True
        return False
    
    def get_game_state(self) -> GameState:
        return GameState(
            player_position=self.player_pos,
            goal_position=self.goal_pos,
            maze_layout=self.grid,
            game_over=self.game_over
        )
