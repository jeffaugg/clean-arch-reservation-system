import { ApiProperty } from "@nestjs/swagger";

class ReviewAuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class PropertyReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ReviewAuthorDto })
  author: ReviewAuthorDto;

  static fromModel(review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    author: { id: string; name: string };
  }): PropertyReviewResponseDto {
    const dto = new PropertyReviewResponseDto();
    dto.id = review.id;
    dto.rating = review.rating;
    dto.comment = review.comment;
    dto.createdAt = review.createdAt;
    dto.author = {
      id: review.author.id,
      name: review.author.name,
    };
    return dto;
  }

  static fromModels(
    reviews: {
      id: string;
      rating: number;
      comment: string;
      createdAt: Date;
      author: { id: string; name: string };
    }[],
  ): PropertyReviewResponseDto[] {
    return reviews.map(PropertyReviewResponseDto.fromModel);
  }
}
