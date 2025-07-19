import React from 'react';
import { TileCell } from '../atoms/TileCell';
import { TileData } from '../../types/tilesTypes';

interface TilesGridProps {
  tiles: TileData[];
  gridDimensions: { width: number; height: number };
  cellSize: number;
  onTileClick: (index: number) => void;
  selectedTiles: number[];
}

export const TilesGrid: React.FC<TilesGridProps> = ({ 
  tiles, 
  gridDimensions, 
  cellSize, 
  onTileClick,
  selectedTiles 
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridDimensions.width}, ${cellSize}px)`,
      gap: '8px',
      background: '#2c2d31',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 0 25px rgba(0,0,0,0.4)',
      margin: '20px auto',
    }}>
      {tiles.map((tile, index) => (
        <TileCell
          key={index}
          color={tile.color}
          isRevealed={tile.isRevealed}
          isMatched={tile.isMatched}
          isSelected={selectedTiles.includes(index)}
          onClick={() => onTileClick(index)}
          size={cellSize}
          symbol={tile.symbol}
        />
      ))}
    </div>
  );
};