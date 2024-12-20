import React, { memo, useState, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, IconButton, TextField, Box, ClickAwayListener } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Card = memo(({ card, index, onUpdateCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(card.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = useCallback(() => {
    if (editText.trim() && editText !== card.content) {
      onUpdateCard(card.id, editText.trim());
    } else {
      setEditText(card.content);
    }
    setIsEditing(false);
  }, [card.id, card.content, editText, onUpdateCard]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 3 : 1}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            p: 1.5,
            mb: 1,
            backgroundColor: snapshot.isDragging ? 'grey.100' : 'background.paper',
            transform: snapshot.isDragging 
              ? provided.draggableProps.style.transform + ' rotate(2deg)' 
              : provided.draggableProps.style?.transform,
            '&:hover': {
              backgroundColor: 'grey.50',
            },
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
          }}
        >
          {isEditing ? (
            <ClickAwayListener onClickAway={handleSubmit}>
              <TextField
                multiline
                fullWidth
                size="small"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    py: 0,
                  }
                }}
              />
            </ClickAwayListener>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Typography 
                variant="body2" 
                color="text.primary"
                sx={{ 
                  flexGrow: 1,
                  wordBreak: 'break-word',
                  pr: isHovered ? 5 : 0 
                }}
                onClick={() => setIsEditing(true)}
              >
                {card.content}
              </Typography>
              {isHovered && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    display: 'flex',
                    gap: 0.5,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={() => setIsEditing(true)}
                    sx={{ 
                      padding: 0.5,
                      '&:hover': { backgroundColor: 'grey.200' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => onDeleteCard(card.id)}
                    sx={{ 
                      padding: 0.5,
                      '&:hover': { backgroundColor: 'grey.200' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Draggable>
  );
});

Card.displayName = 'Card';

export default Card; 