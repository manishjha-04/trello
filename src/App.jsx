import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import List from './components/List';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0079bf',
    },
    background: {
      default: '#0079bf',
      paper: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [lists, setLists] = useState([]);

  const addList = useCallback(() => {
    const newList = {
      id: `list-${Date.now()}`,
      title: 'New List',
      cards: []
    };
    setLists(prevLists => [...prevLists, newList]);
  }, []);

  const updateListTitle = useCallback((listId, newTitle) => {
    setLists(prevLists => prevLists.map(list => 
      list.id === listId 
        ? { ...list, title: newTitle }
        : list
    ));
  }, []);

  const addCard = useCallback((listId, cardText) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, { id: `card-${Date.now()}`, content: cardText }]
        };
      }
      return list;
    }));
  }, []);

  const updateCard = useCallback((listId, cardId, newContent) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: list.cards.map(card =>
            card.id === cardId
              ? { ...card, content: newContent }
              : card
          )
        };
      }
      return list;
    }));
  }, []);

  const deleteCard = useCallback((listId, cardId) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        };
      }
      return list;
    }));
  }, []);

  const deleteList = useCallback((listId) => {
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
  }, []);

  const onDragEnd = useCallback((result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle list reordering
    if (type === 'list') {
      setLists(prevLists => {
        const newLists = Array.from(prevLists);
        const [removed] = newLists.splice(source.index, 1);
        newLists.splice(destination.index, 0, removed);
        return newLists;
      });
      return;
    }

    // Handle card reordering
    setLists(prevLists => {
      const sourceList = prevLists.find(list => list.id === source.droppableId);
      const destList = prevLists.find(list => list.id === destination.droppableId);
      const draggingCard = sourceList.cards.find(card => card.id === draggableId);

      if (source.droppableId === destination.droppableId) {
        // Moving within the same list
        const newCards = Array.from(sourceList.cards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, draggingCard);

        return prevLists.map(list =>
          list.id === sourceList.id
            ? { ...list, cards: newCards }
            : list
        );
      } else {
        // Moving to another list
        const sourceCards = Array.from(sourceList.cards);
        sourceCards.splice(source.index, 1);

        const destinationCards = Array.from(destList.cards);
        destinationCards.splice(destination.index, 0, draggingCard);

        return prevLists.map(list => {
          if (list.id === source.droppableId) {
            return { ...list, cards: sourceCards };
          }
          if (list.id === destination.droppableId) {
            return { ...list, cards: destinationCards };
          }
          return list;
        });
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            p: 3,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
        >
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  p: 1,
                }}
              >
                {lists.map((list, index) => (
                  <List
                    key={list.id}
                    list={list}
                    onAddCard={addCard}
                    onDeleteList={deleteList}
                    onUpdateTitle={updateListTitle}
                    onUpdateCard={updateCard}
                    onDeleteCard={deleteCard}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addList}
            sx={{
              height: 'fit-content',
              minWidth: 300,
              m: 1,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Add another list
          </Button>
        </Box>
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;
