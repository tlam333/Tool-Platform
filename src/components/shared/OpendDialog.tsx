import Link from "next/link";
import Balancer from "react-wrap-balancer";
interface Props {
  heading?: string;
  description?: string;
  showDialog: boolean;
  children?: React.ReactNode;
  closePath: string;
}

export default function OpendDialog({
  showDialog,
  heading,
  description,
  children,
  closePath,
}: Props) {
  return (
    <>
      {showDialog && (
        <dialog className="modal modal-open">
          <div className="modal-box text-center">
            <Link
              href={closePath}
              scroll={false}
              className="btn btn-sm btn-circle btn-ghost bg-base-200 absolute right-2 top-5"
            >
              ✕
            </Link>

            <h2 className="font-bold">{heading}</h2>
            <p className="py-4">
              <Balancer>{description}</Balancer>
            </p>
            {children}
          </div>
        </dialog>
      )}
    </>
  );
}
