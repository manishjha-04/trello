import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

const CardContainer = styled.div`
  background: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 #091e4240;
  cursor: pointer;
  margin-bottom: 8px;
  min-height: 20px;
  padding: 6px 8px;
  position: relative;
  user-select: none;
  
  &:hover {
    background: #f4f5f7;
  }
`;

const CardContent = styled.div`
  overflow-wrap: break-word;
  font-size: 14px;
  color: #172b4d;
`;

const Card = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? '#f4f5f7' : 'white',
          }}
        >
          <CardContent>{card.content}</CardContent>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card; 