import React, { useState } from "react";
import styled from "styled-components";
import { Star as StarIcon } from "lucide-react";

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const BackgroundContainer = styled.div`
  background-color: transparent;
  width: 206px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 4px; 
`;

const StyledStar = styled.div<{ filled: string }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 38px;
    height: 40px;
    color: ${(props) => (props.filled ? "#facc15" : "#d1d5db")};
  }
`;

const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  console.log('rating:',rating);

  const handleRating = (index: number) => {
    let newRating = rating;
    if (index + 1 === rating) {
      newRating = index;
    } else if (index < rating) {
      newRating = index;
    } else {
      newRating = index + 1;
    }

    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <BackgroundContainer>
      <StarContainer>
        {Array.from({ length: totalStars }, (_, index) => (
          <StyledStar
            key={index}
            filled={String(index < rating)}
            onClick={() => handleRating(index)}
          >
            <StarIcon fill={index < rating ? "#facc15" : "none"} stroke="#facc15" />
          </StyledStar>
        ))}
      </StarContainer>
    </BackgroundContainer>
  );
};

export default StarRating;
