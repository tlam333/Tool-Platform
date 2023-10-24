import Balancer from "react-wrap-balancer";
import { Quote } from "lucide-react";
interface Props {
  reviews: { user: string; reviewText: string }[];
}
function ReviewCarousal({ reviews }: Props) {
  return (
    <div className="carousel carousel-center md:p-4 gap-2 lg:space-x-4 my-5">
      {reviews.map((review) => (
        <div
          className="carousel-item bg-base-100 max-w-sm md:max-w-lg rounded-box py-4 md:py-10 px-1"
          key={review.reviewText}
        >
          <div>
            <div className="m-5">
              <Balancer>
                <span className="text-primary">
                  <Quote size={30} />
                </span>
              </Balancer>
            </div>
            <div>
              <h3>
                <Balancer>{review.reviewText}</Balancer>
              </h3>
            </div>
            <div className="m-5">
              <Balancer>
                <span className="text-primary">
                  <Quote size={30} />
                </span>
              </Balancer>
            </div>
            <div className="mt-5">
              <h2 className="text-primary mt-2">- {review.user}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewCarousal;
