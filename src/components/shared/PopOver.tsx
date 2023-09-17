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
      {/* Open the modal using document.getElementById('ID').showModal() method
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        open modal
      </button> */}
      <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{heading}</h3>
          <p className="py-4">{subheading}</p>
          <div className="modal-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export default PopOver;
