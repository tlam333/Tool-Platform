"use client";

interface Props {
  id: string;
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
}

function PopOver({ id, heading, subheading, children }: Props) {
  return (
    <>
      <dialog id={id} className="modal modal-middle">
        <div className="modal-box mt-5 text-center">
          <form method="dialog">
            <button className="btn btn-sm bg-base-200 btn-circle btn-ghost absolute right-2 top-5">
              ✕
            </button>
          </form>
          <h3 className="font-bold ">{heading}</h3>
          <p className="py-4">{subheading}</p>
          <div className="modal-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export default PopOver;
