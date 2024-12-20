import React, { memo, useState, useCallback } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, IconButton, TextField, Button, Box, ClickAwayListener } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Card from './Card';

const List = memo(({ list, onAddCard, onDeleteList, onUpdateTitle, onUpdateCard, onDeleteCard, index }) => {
  const [newCardText, setNewCardText] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(list.title);

  const handleAddCard = useCallback(() => {
    if (newCardText.trim()) {
      onAddCard(list.id, newCardText.trim());
      setNewCardText('');
      setIsAddingCard(false);
    }
  }, [list.id, newCardText, onAddCard]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    }
  }, [handleAddCard]);

  const handleTitleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (titleText.trim()) {
        onUpdateTitle(list.id, titleText.trim());
        setIsEditingTitle(false);
      }
    }
  }, [list.id, titleText, onUpdateTitle]);

  const handleTitleSubmit = useCallback(() => {
    if (titleText.trim() && titleText !== list.title) {
      onUpdateTitle(list.id, titleText.trim());
    } else {
      setTitleText(list.title);
    }
    setIsEditingTitle(false);
  }, [list.id, list.title, titleText, onUpdateTitle]);

  const handleUpdateCard = useCallback((cardId, newContent) => {
    onUpdateCard(list.id, cardId, newContent);
  }, [list.id, onUpdateCard]);

  const handleDeleteCard = useCallback((cardId) => {
    onDeleteCard(list.id, cardId);
  }, [list.id, onDeleteCard]);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          {...provided.draggableProps}
          ref={provided.innerRef}
          elevation={2}
          sx={{
            width: 300,
            bgcolor: 'grey.100',
            m: 1,
            borderRadius: 2,
            transition: 'transform 0.2s ease',
            transform: snapshot.isDragging 
              ? provided.draggableProps.style.transform + ' rotate(1deg)'
              : provided.draggableProps.style?.transform
          }}
        >
          <Box
            {...provided.dragHandleProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            {isEditingTitle ? (
              <ClickAwayListener onClickAway={handleTitleSubmit}>
                <TextField
                  size="small"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  onKeyPress={handleTitleKeyPress}
                  autoFocus
                  sx={{ 
                    width: '80%',
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 0.5,
                    }
                  }}
                />
              </ClickAwayListener>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 600,
                    flexGrow: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      '& + .edit-icon': {
                        opacity: 1,
                      }
                    }
                  }}
                  onClick={() => setIsEditingTitle(true)}
                >
                  {list.title}
                </Typography>
                <IconButton
                  className="edit-icon"
                  size="small"
                  onClick={() => setIsEditingTitle(true)}
                  sx={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    ml: 1,
                    '&:hover': {
                      opacity: 1,
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <IconButton 
              size="small" 
              onClick={() => onDeleteList(list.id)}
              sx={{ color: 'grey.500', '&:hover': { color: 'grey.700' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Droppable droppableId={list.id} type="card">
            {(droppableProvided, droppableSnapshot) => (
              <Box
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                sx={{
                  minHeight: 20,
                  p: 1,
                  transition: 'background-color 0.2s ease',
                  bgcolor: droppableSnapshot.isDraggingOver ? 'action.hover' : 'transparent'
                }}
              >
                {list.cards.map((card, cardIndex) => (
                  <Card 
                    key={card.id} 
                    card={card} 
                    index={cardIndex}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={handleDeleteCard}
                  />
                ))}
                {droppableProvided.placeholder}
              </Box>
            )}
          </Droppable>

          {isAddingCard ? (
            <Box sx={{ p: 1 }}>
              <TextField
                multiline
                fullWidth
                size="small"
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a title for this card..."
                autoFocus
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddCard}
                disabled={!newCardText.trim()}
                size="small"
                sx={{ mr: 1 }}
              >
                Add Card
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardText('');
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setIsAddingCard(true)}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'text.secondary',
                p: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Add a card
            </Button>
          )}
        </Paper>
      )}
    </Draggable>
  );
});

List.displayName = 'List';

export default List; 