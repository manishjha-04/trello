import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import List from './components/List';

const Container = styled.div`
  display: flex;
  padding: 20px;
  overflow-x: auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

const ListsContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const AddListButton = styled.button`
  min-width: 272px;
  padding: 10px;
  margin: 0 4px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 3px;
  color: #172b4d;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  height: fit-content;
  
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

function App() {
  const [lists, setLists] = useState([]);

  const addList = () => {
    const newList = {
      id: `list-${Date.now()}`,
      title: 'New List',
      cards: []
    };
    setLists([...lists, newList]);
  };

  const addCard = (listId, cardText) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, { id: `card-${Date.now()}`, content: cardText }]
        };
      }
      return list;
    }));
  };

  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const onDragEnd = (result) => {
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
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);
      setLists(newLists);
      return;
    }

    // Handle card reordering
    const sourceList = lists.find(list => list.id === source.droppableId);
    const destList = lists.find(list => list.id === destination.droppableId);
    const draggingCard = sourceList.cards.find(card => card.id === draggableId);

    if (source.droppableId === destination.droppableId) {
      // Moving within the same list
      const newCards = Array.from(sourceList.cards);
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, draggingCard);

      const newList = {
        ...sourceList,
        cards: newCards
      };

      setLists(lists.map(list => 
        list.id === newList.id ? newList : list
      ));
    } else {
      // Moving to another list
      const sourceCards = Array.from(sourceList.cards);
      sourceCards.splice(source.index, 1);
      const newSourceList = {
        ...sourceList,
        cards: sourceCards
      };

      const destinationCards = Array.from(destList.cards);
      destinationCards.splice(destination.index, 0, draggingCard);
      const newDestList = {
        ...destList,
        cards: destinationCards
      };

      setLists(lists.map(list => {
        if (list.id === source.droppableId) {
          return newSourceList;
        }
        if (list.id === destination.droppableId) {
          return newDestList;
        }
        return list;
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <ListsContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, index) => (
                <List
                  key={list.id}
                  list={list}
                  onAddCard={addCard}
                  onDeleteList={deleteList}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ListsContainer>
          )}
        </Droppable>
        <AddListButton onClick={addList}>
          + Add another list
        </AddListButton>
      </Container>
    </DragDropContext>
  );
}

export default App;
