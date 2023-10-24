import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h2>Product not found!</h2>
      <br />
      <Link className="btn btn-primary" href="/for-hire">
        Go to product list
      </Link>
    </div>
  );
}
