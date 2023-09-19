import Balancer from "react-wrap-balancer";

interface props {
  message: string;
}

function Alert({ message }: props) {
  return (
    <div className="alert alert-info bottom-5 flex justify-center md:w-1/2 fixed z-99">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>

      <span>
        <Balancer>{message}</Balancer>
      </span>
      <button className="btn btn-sm">Ok</button>
    </div>
  );
}

export default Alert;
