import Modal from "@/components/shared/Modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { Google, Facebook, LoadingDots } from "@/components/shared/icons";

import Image from "next/image";
import SignInComponent from "../user/forms/SignIn";

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [signInClickedGm, setSignInClickedGm] = useState(false);
  const [signInClickedFb, setSignInClickedFb] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <SignInComponent />
    </Modal>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback]
  );
}
