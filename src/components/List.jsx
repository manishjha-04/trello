import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import Card from './Card';

const ListContainer = styled.div`
  background: #ebecf0;
  border-radius: 3px;
  width: 272px;
  padding: 8px;
  height: fit-content;
  margin: 0 4px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
`;

const ListTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #172b4d;
  }
`;

const AddCardForm = styled.div`
  margin-top: 8px;
`;

const CardInput = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  padding: 6px 8px;
  border-radius: 3px;
  box-shadow: 0 1px 0 #091e4240;
  margin-bottom: 8px;
  min-height: 54px;
`;

const AddCardButton = styled.button`
  background: #0079bf;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  
  &:hover {
    background: #026aa7;
  }
`;

const CardsContainer = styled.div`
  min-height: 20px;
  padding: 0 4px;
`;

const List = ({ list, onAddCard, onDeleteList, index }) => {
  const [newCardText, setNewCardText] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCardText.trim()) {
      onAddCard(list.id, newCardText.trim());
      setNewCardText('');
      setIsAddingCard(false);
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <ListContainer
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <ListHeader {...provided.dragHandleProps}>
            <ListTitle>{list.title}</ListTitle>
            <DeleteButton onClick={() => onDeleteList(list.id)}>×</DeleteButton>
          </ListHeader>

          <Droppable droppableId={list.id} type="card">
            {(droppableProvided) => (
              <CardsContainer
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                {list.cards.map((card, cardIndex) => (
                  <Card key={card.id} card={card} index={cardIndex} />
                ))}
                {droppableProvided.placeholder}
              </CardsContainer>
            )}
          </Droppable>

          {isAddingCard ? (
            <AddCardForm>
              <CardInput
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                placeholder="Enter a title for this card..."
                autoFocus
              />
              <AddCardButton onClick={handleAddCard}>
                Add Card
              </AddCardButton>
            </AddCardForm>
          ) : (
            <AddCardButton 
              onClick={() => setIsAddingCard(true)}
              style={{ 
                background: 'transparent', 
                color: '#5e6c84',
                textAlign: 'left',
                padding: '8px',
                width: '100%'
              }}
            >
              + Add a card
            </AddCardButton>
          )}
        </ListContainer>
      )}
    </Draggable>
  );
};

export default List; 