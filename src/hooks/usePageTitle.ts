import { useEffect } from "react";

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} | RxVault` : "RxVault — Your Digital Prescription Companion";
  }, [title]);
};

export default usePageTitle;
